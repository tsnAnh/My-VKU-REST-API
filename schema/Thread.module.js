const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    title: {
        type: String
    },
    forumId: {
        type: Schema.Types.ObjectId,
        ref: 'Forum'
    },
    userDisplayName: String,
    userAvatar: String,
    numberOfReplies: {
        type: Number,
        default: 1
    },
    numberOfViews: {
        type: Number,
        default: 0
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Number,
        default: new Date().getTime()
    },
    lastUpdatedOn: {
        type: Number,
        default: new Date().getTime()
    },
    posts: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Reply'
        }],
        default: []
    },
    editHistory: {
        type: [String],
        default: []
    }
});

module.exports = Thread = mongoose.model('thread', ThreadSchema);