const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    content: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userDisplayName: String,
    userAvatar: String,
    images: [String],
    threadId: {
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    },
    threadTitle: String,
    editHistory: [String],
    createdAt: {
        type: Number,
        default: new Date().getTime()
    },
    quoted: {
        type: Schema.Types.ObjectId,
    },
    quotedReply: this,
});

module.exports = Reply = mongoose.model('reply', ReplySchema);