const { isIDGood, handleError } = require('../../middleware/utils')
const Message = require('../../models/message')


/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const deleteMessages = async (req) => {
  try {

    if(req.DeleteMessageIds.length == 0 || req.DeleteMessagesBy.length == 0)
    {
      return ({status:400, message:"DeleteMessageIds or DeleteMessagesBy: cannot be empty!!"});
    }
    
    let deletedStatus;

    let removeMessageFromStar;
    
    const Ids =req.DeleteMessageIds;

    await Message.updateMany({$and: [{_id: { $in: Ids}},{deletedBy:{$nin:[req.DeleteMessagesBy]}}]},{$push:{deletedBy:req.DeleteMessagesBy}},{new:true})
                .then(()=>{deletedStatus =({ status: 200, message: "successfully messages has deleted!!"});})
                .catch(Err => {
                  deletedStatus =({status: 500,message:Err.message || "Some error occurred while deleting message."});
                 });
                 if(deletedStatus.status == 200){
                      await Message.updateMany({_id: { $in: Ids}},{$pull:{starMessageBy:req.DeleteMessagesBy}},{new:true})
                      .then(()=>{removeMessageFromStar =({ status: 200, message: "successfully messages has unstared!!"});})
                      .catch(Err => {
                        removeMessageFromStar =({status: 500,message:Err.message || "Some error occurred while making unstar message."});
                      });
                      if(removeMessageFromStar.status == 200){
                        return deletedStatus;
                      }
                      else if(removeMessageFromStar.status == 500){
                        return deletedStatus;
                      }
                 }
                 else if(deletedStatus.status == 500){
                   return result;
                 }
       
  } catch (error) {
    console.log(error)
    //handleError(error)
  }
}

module.exports = {deleteMessages}
