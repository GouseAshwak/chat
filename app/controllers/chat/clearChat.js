const { isIDGood, handleError } = require('../../middleware/utils')
const Message = require('../../models/message')


/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const clearChat = async (req) => { console.log(req)
  try {
  
    if(req.conversationId.length == 0 || req.senderId.length == 0|| req.deleteStarMessage.length == 0)
    {
      return ({status:400, message:"conversationId, senderId  or deleteStarMessage cannot be empty!!"});
    }
    
    const conversation_Id =req.conversationId;

    const sender_Id = req.senderId;

    const deleteStarMessage = req.deleteStarMessage;

    let clearChat_Status;

    //deleteStarMessage if false
    if(deleteStarMessage == false)
    {   
        await Message.updateMany({$and: [{conversationId:conversation_Id},{deletedBy:{$nin:[sender_Id]}},{starMessageBy:{$nin:[sender_Id]}}]},{$push:{deletedBy:sender_Id}},{new:true})
      .then(()=>{
                clearChat_Status =({ status: 200, message: "successfully chat has clear!!"});
                })
      .catch(Err => {
                      clearChat_Status=({status: 500,message:Err.message || "Some error occurred while clearning chat."});
                    });
    }
    //deleteStarMessage if true
    else if(deleteStarMessage == true)
    {
      await Message.updateMany({$and: [{conversationId:conversation_Id},{deletedBy: {$nin:[sender_Id]}}]},{$push:{deletedBy:sender_Id}},{new:true})
      .then(async()=>{
                
                await Message.updateMany({$and: [{conversationId:conversation_Id},{user:sender_Id},{deletedBy: {$in:[sender_Id]}}]},{$pull:{starMessageBy:sender_Id}},{new:true})
                .then(()=>{
                          clearChat_Status =({ status: 200, message: "successfully chat has clear!!"});
                          })
                .catch(Err => {
                              clearChat_Status=({status: 500,message:Err.message || "Some error occurred while clearning chat."});
                              });
                })
      .catch(Err => {
                    clearChat_Status=({status: 500,message:Err.message || "Some error occurred while clearning chat."});
                    });
    }

    //sending status to socket!!
    if(clearChat_Status.status == 200){
      return clearChat_Status;
    }
    else if(clearChat_Status.status == 500)
    {
      return clearChat_Status;
    }
  } catch (error) { 
    console.log(error)
   // handleError(res, error)
  }
}

module.exports = {clearChat}
