const {handleError } = require('../../middleware/utils/handleError')
const Message = require('../../models/message')
const asyncForEach = require('async-await-foreach') 


/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const saveForwardMessage = async (req) => { console.log("req:",req)
  try {

    if(req.senderId.length == 0 ||req.conversationId.length == 0 || req.messages.length == 0)
    {
      return({status:400, message:"conversationId or senderId or messages cannot be empty!!"});
    }
    
    let user = req.senderId;
    let conversationId =req.conversationId;
    let messages= req.messages;
    let Status = [];
    
    await asyncForEach(messages, async message => {  //console.log(message.text)
    
      let newMesssage = await new Message({
                                            conversationId,
                                            user,
                                            chatType:message.chatType,
                                            text:message.text,
                                            forwardMessage:message.forwardMessage
                                            }).save()
                                            await newMesssage.populate("user","name User_id")
                                            .then((newMesssage)=>{
                                              Status.push({ status: 200,message: "successfully message has saved!!",newMesssage});
                                            })
                                            .catch(Err => {
                                              Status.push({status: 500,message:Err.message || "Some error occurred while saving new message."});
                                            });
    })

    return Status;
  } catch (error) {
    console.log(error)
    //handleError(error)
  }
}

module.exports = {saveForwardMessage}