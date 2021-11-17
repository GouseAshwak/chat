const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
const app = express()
const i18n = require('i18n')
const initMongo = require('./config/mongo')
const appInfo = require('./settings.json')
const path = require('path')
const asyncForEach = require('async-await-foreach') 
const {setupConversationBetweenTwoUsers} = require('./app/controllers/chat/setupConversationBetweenTwoUsers')
const {saveNewChat} =require('./app/controllers/chat/saveNewChat')
const {saveForwardMessage} =require('./app/controllers/chat/saveForwardMessage')
const conversation = require('./app/models/conversation')
const { conversationList } = require('./app/controllers/chat/conversationList')
const {Star_unStar_Messages} = require('./app/controllers/chat/Star_unStar_Messages')
const {retreiveStarMsgList} = require('./app/controllers/chat/retreiveStarMsgList')
const {deleteMessages} = require('./app/controllers/chat/deleteMessages')
const { clearChat } = require('./app/controllers/chat')
const {checkStarMessageInPaticularConversation} = require('./app/controllers/chat/checkStarMessageInPaticularConversation')
global.appInfo = appInfo
// Setup express server port from ENV, default: 3000
app.set('port', appInfo.PORT || 3000)

// for parsing json
app.use(
  bodyParser.json({
    limit: '100mb'
  })
)
// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: '100mb',
    extended: false
  })
)

// i18n
i18n.configure({
  locales: ['en', 'es'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en',
  objectNotation: true
})
app.use(i18n.init)

// Init all other stuff
app.use(cors())
app.use(passport.initialize())
app.use(compression())
app.use(helmet())
//app.use(express.static('public'))

app.get('/', function(req, res) {
	res.send('Welcome to One CC Chat backend application!!!');
  //res.render('index');
});

server = app.listen(app.get('port'))

// Init MongoDB
initMongo()

module.exports = app // for testing

//...........................................................Socket.io.........................//
//socket.io instantiation

const {Server} = require('socket.io');
const ws = require('ws');
const { count } = require('./app/models/conversation')
const io = new Server(server, { wsEngine: ws.Server });
//const io = require("socket.io")(server);

let users = [];
let userStatus;

//add when user is connected!!
const addUser = (userId, socketId) => {
  //console.log(userId,socketId);
  const isExist = users.some((user) => user.userId === userId)
  //console.log(userId,"isExist",isExist);

    if(isExist == false)
      {
          users.push({ userId, socketId });
      }
    else if(isExist == true)
        { 
          //console.log("before socket update:",socketId)
          //Find index of specific object using findIndex method.    
          objIndex = users.findIndex((obj => obj.userId == userId));
          //Update object's socketId property.
          users[objIndex].socketId = socketId;
          //console.log("after socket update:",users[objIndex].socketId,socketId);
        }
};

//get users_list when ever i get connceted!!
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};


io.on("connection", (socket) => {
    
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);

        userStatus = "online";

        //when connected
        console.log(userStatus);

        //socket.broadcast.emit("userStatus",userStatus);

        //say user online
        console.log(users);
    });

    //conversationList
    socket.on('conversationIdList',async(senderId)=>{
    
      const conversationID_List = await conversationList(senderId)

      //console.log(conversationID_List);

      const user = getUser(senderId.senderId);

      //console.log("1111111111111..",user,senderId.senderId);

      io.to(user.socketId).emit("conversationIdList",{conversationID_List});
    })
    
    //setUpConversationId
    socket.on('setUpConversationId',async({senderId,receiverId}) =>{

      let senderI_d = getUser(senderId);

      const result = await setupConversationBetweenTwoUsers({senderId,receiverId});

      console.log("result:", result);
            
      if(result.status == '201'){
          //emit socket to sender!!
          if(senderI_d !== undefined){
              //sending status conersation has setup now!!
              io.to(senderI_d.socketId).emit("setupConversation_status",result)
          }
      }
      else if(result.status == '202'){
           //emit socket to sender!!
           if(senderI_d !== undefined){
              //sending status conersation has setup already!!
              io.to(senderI_d.socketId).emit("setupConversation_status",result)
           
           }
      }
      
    });
  
    //send and get message
    socket.on("sendMessage", async({ senderId, receiverId,chatType,text,conversation_Id,replyMessageToId,forwardMessage}) => {

      const receiver_Id = getUser(receiverId);

      const senderI_d = getUser(senderId);

      console.log("before getMsg:",senderId, receiverId,chatType,text,conversation_Id,replyMessageToId,forwardMessage);

      const newMesssage = await saveNewChat({senderId,chatType,text,conversation_Id,replyMessageToId,forwardMessage});
    
      //emit socket to sender and receiver
      if(senderI_d !== undefined)
      {io.to(senderI_d.socketId).emit("getMessage",{newMesssage});}
      
      if(receiver_Id !== undefined)
      {io.to(receiver_Id.socketId).emit("getMessage",{newMesssage});}

      console.log("after getMsg:",senderId, receiverId,chatType,text, conversation_Id);
    });

    //send and get forward_message
    socket.on("sendForwardMessage", async(forwardMessageObject) => {

         const senderI_d = getUser(forwardMessageObject[0]);

         const senderId = forwardMessageObject[0];

         const receiverIds = forwardMessageObject[1];

         const conversation_Ids = forwardMessageObject[2];

         const messages = forwardMessageObject.slice(3)

         //console.log("before forward getMsg:",{senderId,conversationId,messages});
         let count = 0;
        await asyncForEach(conversation_Ids, async (conversationId) => {
        const newMesssage = await saveForwardMessage({senderId,conversationId,messages});
        
         //emit socket to sender and receiver
         if(senderI_d !== undefined)
         {io.to(senderI_d.socketId).emit("getMessage",{newMesssage});}

         let receiver_Id = getUser(receiverIds[count]);

        // console.log(receiver_Id)

        if(receiver_Id !== undefined)
        {io.to(receiver_Id.socketId).emit("getMessage",{newMesssage});}

        ++count;
          
        }).then(() => {
          console.log("done")
        })
        // console.log("after getMsg:",senderId, receiverId, text, conversation_Id);
    });

    //starMessages
    socket.on("starMessages",async({starMessageBy,starMessageIds})=>{

    let reqType = "Star";

    const  starMessagesStatus = await Star_unStar_Messages({starMessageBy,starMessageIds,reqType});

    console.log("starMessagesStatus:",starMessagesStatus)

    const senderI_d = getUser(starMessageBy);

    //emit socket to sender!!
    if(senderI_d !== undefined)
    {io.to(senderI_d.socketId).emit("starMessages_Status",{starMessagesStatus});}

    });

    //unstarMessages
    socket.on("unStarMessages",async({starMessageBy,starMessageIds})=>{

      let reqType = "unStar"; console.log(starMessageBy,starMessageIds,reqType)
  
      const  unstarMessagesStatus = await Star_unStar_Messages({starMessageBy,starMessageIds,reqType});
  
      console.log("unstarMessagesStatus:",unstarMessagesStatus)

      const senderI_d = getUser(starMessageBy);

      //emit socket to sender!!
      if(senderI_d !== undefined)
      {io.to(senderI_d.socketId).emit("starMessages_Status",{unstarMessagesStatus});}
      });

    //retreiveStarMsgList
    socket.on("starMessageList",async({senderId,conversationID})=>{

      const starMessage_List = await retreiveStarMsgList({senderId,conversationID});

      console.log(starMessage_List)

      const senderI_d = getUser(senderId);

      //emit socket to sender!!
      if(senderI_d !== undefined)
      {io.to(senderI_d.socketId).emit("starMessage_List",{starMessage_List});}

    });
  
    //DeleteMessages
     socket.on("DeleteMessages",async({DeleteMessagesBy,DeleteMessageIds})=>{
  
      const  DeleteMessagesStatus = await deleteMessages({DeleteMessagesBy,DeleteMessageIds});
  
      console.log("deleteMessagesStatus:",DeleteMessagesStatus)
  
      const senderI_d = getUser(DeleteMessagesBy);
  
      //emit socket to sender!!
      if(senderI_d !== undefined)
      {io.to(senderI_d.socketId).emit("DeleteMessages_Status",{DeleteMessagesStatus});}
  
      });

    //clearChat
   socket.on("clearChat",async({conversationId,senderId,deleteStarMessage})=>{

      const  clearChatStatus = await clearChat({conversationId,senderId,deleteStarMessage});
  
      console.log("clearChatStatus:",clearChatStatus);
  
      const senderI_d = getUser(senderId);
  
      //emit socket to sender!!
      if(clearChatStatus.status == 200 && senderI_d !== undefined)
      {  
        io.to(senderI_d.socketId).emit("clearChat_Status",clearChatStatus);
      }
      else if(clearChatStatus.status != 200 && senderI_d !== undefined)
      {  
        io.to(senderI_d.socketId).emit("clearChat_Status",clearChatStatus);
      }
  
      });

    //checkStarMessageInPaticularConversation
    socket.on("checkStarMessage",async({senderId,conversationID})=>{

      const Is_StarMessagePresent = await checkStarMessageInPaticularConversation({senderId,conversationID});

      console.log(Is_StarMessagePresent)

      const senderI_d = getUser(senderId);

      //emit socket to sender!!
      if(senderI_d !== undefined)
      {
        io.to(senderI_d.socketId).emit("Is_StarMessage_Present",{Is_StarMessagePresent});
      }

      });

    //when disconnect
    socket.on("disconnect", () => {

      //when disconnected
      userStatus = 'offline';
      console.log(userStatus);
      //socket.broadcast.emit('userStatus',userStatus);
    });
  }); 