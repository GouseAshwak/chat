const { isIDGood, handleError } = require('../../middleware/utils')
const Message = require('../../models/message')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const checkStarMessageInPaticularConversation = async (req) => {
  try {
   
    const senderId =req.senderId;
    const conversation_Id = req.conversationID;
    let Is_StrMsgPresent;

    if(req.senderId.length == 0 || req.conversationID.length == 0)
    {
      return ({status:400, message:"senderId or conversation_Id: cannot be empty!!"});
    }

    let checkStarMessageStatus;
    await Message.find({$and: [{conversationId:conversation_Id},{starMessageBy: {$in:[senderId]}},{deletedBy: {$nin:[senderId]} }] })
                 .select('-starMessageBy -deletedBy -__v -updatedAt -sent -received -pending')
                 .then((StarMessages)=>{ console.log(StarMessages)
                                        if(StarMessages.length == 0)
                                        {
                                            Is_StrMsgPresent = false;
                                            checkStarMessageStatus =({ status: 200, message: "No star Message Present!!",Is_StrMsgPresent});
                                        }
                                        else if(StarMessages.length !=0){
                                            Is_StrMsgPresent =true;
                                            checkStarMessageStatus =({ status: 200, message: "star Message Present!!",Is_StrMsgPresent});
                                        }   
                                       })
                 .catch(Err => {
                                checkStarMessageStatus= ({status: 500,message:Err.message || "Some error occurred while retrieving stared message."});
                               });

   if(checkStarMessageStatus.status == 200){
     return checkStarMessageStatus;
   }
   else if(checkStarMessageStatus.status == 500)
   {
     return checkStarMessageStatus;
   }
       
  } catch (error) {
    console.log(error)
    //handleError(res, error)
  }
}

module.exports = {checkStarMessageInPaticularConversation}
