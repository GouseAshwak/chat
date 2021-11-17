const {handleError } = require('../../middleware/utils')
const Conversation = require('../../models/conversation')


/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const conversationList = async (req) => { 
  
  try {
      
    if(req.senderId.length == 0)
    {
      return ({status:400, message:"senderId cannot be empty!!"});
    }
   const senderID =req.senderId
   const conversationID_List = await Conversation.find({members: { $in: [senderID] }})
   .populate("members","name User_id profile_info.profile_url")
   return ({status:200, message:"succesfully fetched conversationIdList!!",conversationID_List});
   } catch (error) {
      console.log(error)
    //handleError(error)
  }
}

module.exports = {conversationList}