const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    image: {
        type: [String]
    },
    forum_id: {
        type: Schema.Types.ObjectId,
        ref: 'Forum'
    },
    post_number: {
        type: Number
    },
    view_number: {
        type: Number
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    last_update_on: {
        type: Date,
        default: Date.now()
    },
    slug: {
        type: String
    },
    posts: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }]
    },
    edit_history: {
        type: [String]
    }
});

module.exports = Thread = mongoose.model('threads', ThreadSchema);