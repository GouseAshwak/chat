const {handleError } = require('../../middleware/utils')
const Conversation = require('../../models/conversation')


/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

exports.checkConversationIDExist = async (firstUserId,secondUserId) => {
  var cursor;
  var conversationId;
  await Conversation.findOne({members: { $all: [firstUserId, secondUserId] }}).then(data => {
  if(data != null){
                  cursor = true,
                  conversationId = data._id
                  }
  else if(data == null){
                       cursor = false;
                       conversationId = null;}
  })
    .catch(err => {
      cursor = false;
      conversationId = null;
    });
  console.log(cursor)
  return {cursor,conversationId};
};

const setupConversationBetweenTwoUsers = async (req) => {
  
  try {
      
    console.log("details:",req.senderId, req.receiverId)

    if(req.senderId.length == 0 && req.receiverId.length == 0)
    {
      return ({status:400, message:"senderId and receiverId cannot be empty!!"});
    }
    
    const senderId = req.senderId;

    const receiverId = req.receiverId;

    const result = await this.checkConversationIDExist(senderId,receiverId);

    if(result.cursor == false){
    let setupconversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    return ({ status: 201, message: "successfully Conversation has setup!!",setupconversation});
      /*.then((savedconversation)=>{
          const output = { status: 200, message: "successfully Conversation has setup!!",savedconversation};
          return ("status:200");
       })
       .catch(Err => {
        return({status: 500,message:Err.message || "Some error occurred while conversation setup."});
     });*/
    }
    else if(result.cursor == true){
      //console.log("Conversation has setup already!!");
      const conversationID = result.conversationId
      return ({ status: 202, message: "Conversation has setup already!!",conversationID});
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = {setupConversationBetweenTwoUsers}
