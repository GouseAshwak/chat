const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types
const mongoosePaginate = require('mongoose-paginate-v2')

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {type:ObjectId,ref:"Conversation"},

    replyMessageToId:{type:ObjectId,ref:"Message",default:undefined},

    chatType:{type:String,required:true},

    user: {type:ObjectId,ref:"User"},

    text: {type: String,default:undefined},

    meida : {type: String,default:undefined},

    forwardMessage:{type:Boolean,default:false},

    starMessageBy:[{type:ObjectId,ref:"User"}],

    deletedBy:[{type:ObjectId,ref:"User"}],

    sent: {type:Boolean,default:false},

    received: {type:Boolean,default:false},
    
    pending: {type:Boolean,default:false},

  },{ timestamps: true }
);

MessageSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("Message", MessageSchema);