const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const mongoosePaginate = require('mongoose-paginate-v2')

const ConversationSchema = new mongoose.Schema(
    {
      members:[{type:ObjectId,ref:"User"}]
    },{ timestamps: true })

ConversationSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("Conversation",ConversationSchema)