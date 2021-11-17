const {handleError } = require('../../middleware/utils/handleError')
const Message = require('../../models/message')


/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const saveNewChat = async (req) => { console.log("req:",req);
  try {
   
    if(req.conversation_Id.length == 0 || req.text.length == 0)
    {
      return({status:400, message:"conversationId or text cannot be empty!!"});
    }
    
    const conversationId =req.conversation_Id;
    const user = req.senderId;
    const text =req.text;
    const chatType = req.chatType;
    let newMesssage;
    let New_Messsage;
    let NewMesssage;
    // update boolean value to true if it is forwardMessage.
    if(req.forwardMessage == true){forwardMessage = true;}
    else if(req.forwardMessage == false){forwardMessage = false;}

    //ping message.
    if(req.replyMessageToId.length==0){
        newMesssage = await Message.create({
        conversationId,
        user,
        chatType,
        text,
        forwardMessage
        })
        /*.then(()=>{
          return({ status: 200, message: "successfully message has saved!!"});
         })
         .catch(Err => {
         return({
            status: 500,
            message:
              Err.message || "Some error occurred while saving new message."
          });
       });*/
       NewMesssage = await newMesssage.populate("user","name User_id")
       return({ status: 200, message: "successfully message has saved!!",NewMesssage});
    }
    //reply to ping messsage.
   else if(req.replyMessageToId.length!=0){
   let replyMessageToId = req.replyMessageToId;
   newMesssage =  await Message.create({
    conversationId,
    replyMessageToId,
    user,
    forwardMessage,
    text
    })/*.then(()=>{
     return({ status: 200, message: "successfully message has saved!!"});
     })
     .catch(Err => {
      return({
        status: 500,
        message:
          Err.message || "Some error occurred while saving new message."
      });
   });*/
   New_Messsage =await newMesssage.populate({path:"replyMessageToId",select:'text',populate:{path:'user',model:'User', select:'name User_id'}});
   NewMesssage= await New_Messsage.populate("user","name User_id");
   return({ status: 200, message: "successfully message has saved!!",NewMesssage});
    }
       
  } catch (error) {
    console.log(error)
    //handleError(error)
  }
}

module.exports = {saveNewChat}