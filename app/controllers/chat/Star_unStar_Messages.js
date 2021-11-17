const { isIDGood, handleError } = require('../../middleware/utils')
const Message = require('../../models/message')


/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const Star_unStar_Messages = async (req) => { 
  try {

    if(req.starMessageIds.length == 0 || req.starMessageBy.length == 0)
    {
      return ({status:400, message:"starMessageId or starMessageBy: cannot be empty!!"});
    }

    let result;
    
    const Ids =req.starMessageIds;
    if(req.reqType == "Star"){ // to mark as star message 
                await Message.updateMany({$and: [{_id: { $in: Ids}},{starMessageBy:{$nin:[req.starMessageBy]}}]},{$push:{starMessageBy:req.starMessageBy}},{new:true})
                .then(()=>{result =({ status: 200, message: "successfully message has marked as star!!"});})
                .catch(Err => {
                 result =({status: 500,message:Err.message || "Some error occurred while marking star to message."});
                 });
                 if(result.status == 200){
                   return result;
                 }
                 else if(result.status == 500){
                   return result;
                 }
        }
    else if(req.reqType == "unStar"){ // to mark as unstar message
                await Message.updateMany({_id: { $in: Ids}},{$pull:{starMessageBy:req.starMessageBy}},{new:true})
                .then(()=>{result = ({ status: 200, message: "successfully message has unmarked from star!!"});})
                .catch(Err => {
                result =({status: 500,message:Err.message || "Some error occurred while marking unstar to message."});
                });
                if(result.status == 200){
                  return result;
                }
                else if(result.status == 500){
                  return result;
                }
        }
  } catch (error) {
    console.log(error)
   // handleError(res, error)
  }
}

module.exports = {Star_unStar_Messages}