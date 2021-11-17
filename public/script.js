//const socket = io("http://qachatonecc.ap-northeast-2.elasticbeanstalk.com/");
const io = window.io;
const socket = io();
const messageContainer = document.getElementById('message-container')
const imageContainer = document.getElementById('image-container')
const previewImage = document.getElementById("preview-Image")
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const imageInput = document.getElementById('image-input')
const senderName = document.getElementById('senderId')
const receiverName = document.getElementById('receiverId')
const conversationId = document.getElementById('conversationId')

//realtime chat
socket.on('getMessage',(data) => {
  console.log("newMessage101",data);
  appendMessage(data)})

//get previousChat
socket.on('previousChat',(getChat)=>{
  console.log(getChat)
})

//conversationIdList
socket.on('conversationIdList',(conversationID_List)=>{
  console.log(conversationID_List)
})

//user-status'
socket.on('userStatus', (userStatus) => {
  console.log(userStatus)
})

//starMessages_Status
socket.on('starMessages_Status',(starMessages_Status)=>{
  console.log(starMessages_Status)
})

//starMessages_List
socket.on('starMessage_List',(starMessageList)=>{
  console.log(starMessageList)
})

//DeleteMessages_Status
socket.on('DeleteMessages_Status',(DeleteMessagesStatus)=>{
  console.log(DeleteMessagesStatus)
})

//clearChat_Status
socket.on('clearChat_Status',(clearChatStatus)=>{
  console.log(clearChatStatus)
})

//Is_StarMessage_Present
socket.on('Is_StarMessage_Present',(Is_StarMessagePresent)=>{
  console.log(Is_StarMessagePresent)
})

/*socket.on('getUsers', (users) => { 
  appendMessage(`${users}: online`)
})*/

//to join chat
document.getElementById("add_user").addEventListener('click', e => {
  e.preventDefault()
  
  let senderID = senderName.value
  
    //adding user....
    socket.emit('addUser', senderID)
  
    console.log(senderID)
    appendMessage(`You: online`)
  })

//To send message.....
/*messageForm.addEventListener('submit', e => {
  e.preventDefault()

  let message = messageInput.value
  let senderID = senderName.value
  let receiverID = receiverName.value

  //console.log(message,senderID,receiverID)
  appendMessage(`You: ${message}`)
  socket.emit('sendMessage', {
    senderId: senderID,
    receiverId: receiverID,
    text: message,
  })
  //senderName.value = ''
  receiverName.value = ''
  messageInput.value = ''
})*/

messageForm.addEventListener('submit', e => {
  e.preventDefault()

  let message = messageInput.value
 //let image = imageInput.value
  let senderID = senderName.value
  let receiverID = receiverName.value
  let conversationID = conversationId.value

  //console.log(message,senderID,receiverID)
  if(message.length !=0)
  {
    appendMessage(`You: ${message}`)
  }
  /*if(image.length!=0)
  {  console.log(image)
    const imageElement = document.createElement('img')
    imageElement.src = "https://english.cdn.zeenews.com/sites/default/files/2021/07/02/948471-galleryronaldoinsta.jpg";
    imageElement.style="width:150px;height:150px;"
    imageContainer.append(imageElement)
  }*/

  //setupConversationIdBetweenUser
  /*socket.emit('setUpConversationId',{
    senderId: senderID,
    receiverId: receiverID
  })*/

  /*//conversationList
  socket.emit('conversationIdList',{
    senderId: senderID
  })*/
  
  /*socket.on('setupConversation_status',(Status)=>{
    
  console.log("status_code:",Status.status)

  if(Status.status == '202'  || Status.status == '201'){
    console.log("before emit:",senderID, receiverID,message)
    socket.emit('sendMessage', {
      senderId: senderID,
      receiverId: receiverID,
      chatType:"Text",
      text: message,
      conversation_Id:conversationID,
      replyMessageToId:"",
      forwardMessage:false});  
   }
    console.log("after emit:",senderID, receiverID,message,conversationID)
   }
    //,senderName.value = '',
    //receiverName.value = '',
    //messageInput.value = ''
  )*/
  
  /*//starMessage
  socket.emit('starMessages',{
    starMessageBy:"60f920e162979e7e45e428fa",
    starMessageIds:["614b158cae133d25a5a2e4a9"]
  })*/

  //unStarMessage
  /*socket.emit('unStarMessages',{
    starMessageBy:"60f91a7562979e7e45e428bd",
    starMessageIds:["613b0709261ab735ec0a381e"]
  })*/

  /*//starMessageList
  socket.emit('starMessageList',{
  senderId: senderID,
  conversationID
 })*/

 /*//DeleterMessage
  socket.emit('DeleteMessages',{
    DeleteMessagesBy:"60f91a7562979e7e45e428bd",
    DeleteMessageIds:["614b158cae133d25a5a2e4a9","614b158fae133d25a5a2e4ac"]
  })*/

 /* //clearChat for one side!!
  socket.emit('clearChat',{
    conversationId:conversationID,
    senderId:senderID,
    deleteStarMessage : false
  })*/

  /* //checkStarMessage
  socket.emit('checkStarMessage',{
  senderId: senderID,
  conversationID
 })*/

 socket.emit('sendForwardMessage', [
  senderId= "60f91a7562979e7e45e428bd",
  receiverId=["60f920e162979e7e45e428fa","60f9249c62979e7e45e4293f","610036b3b9308c4eef800ea1"],
  conversation_Id =["6140397dff5dd765ecb6c35c","61403eb2ff5dd765ecb6c39b","613f54187bbc55b7a0b2bce6"],
  {
  chatType:"Text",
  text: "message1",
  forwardMessage:false
  },
  { chatType:"Text",
    text: "message2",
    forwardMessage:true
  },
  { chatType:"Text",
    text: "message3",
    forwardMessage:true
  }
]);

})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}