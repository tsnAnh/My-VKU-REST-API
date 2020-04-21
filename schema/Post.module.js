const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content: String,
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    user_display_name: String,
    user_avatar: String,
    images: {
        type: [String]
    },
    thread_id: {
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    },
    thread_title: String,
    edit_history: {
        type: [String]
    },
    created_at: {
        type: Number,
        default: new Date().getTime()
    },
    quoted: {
        type: Schema.Types.ObjectId,
    },
    upvote: Number,
});

module.exports = Post = mongoose.model('posts', PostSchema);