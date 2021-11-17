const { isIDGood, handleError } = require('../../middleware/utils')
const Message = require('../../models/message')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const retreiveStarMsgList = async (req) => {
  try {
   
    const senderId =req.senderId;
    const conversation_Id = req.conversationID;

    if(req.senderId.length == 0 || req.conversationID.length == 0)
    {
      return ({status:400, message:"senderId or conversation_Id: cannot be empty!!"});
    }

    let result;
    await Message.find({$and: [{conversationId:conversation_Id},{starMessageBy: {$in:[senderId]}},{deletedBy: {$nin:[senderId]} }] })
     .select('-starMessageBy -deletedBy -__v -updatedAt -sent -received -pending')
    .populate('user','name User_id profile_info.profile_url')
    .populate({path:"conversationId",select:"-createdAt -updatedAt",populate:{path:'members',model:'User', select:'name User_id profile_info.profile_url'}})
    .then((StarMessages)=>{
      result =({ status: 200, message: "successfully retrieved stared message!!",StarMessages});})
     .catch(Err => {
      result= ({status: 500,message:Err.message || "Some error occurred while retrieving stared message."});
   });

   if(result.status == 200){
     return result;
   }
   else if(result.status == 500)
   {
     return result;
   }
       
  } catch (error) {
    console.log(error)
    //handleError(res, error)
  }
}

module.exports = {retreiveStarMsgList}
