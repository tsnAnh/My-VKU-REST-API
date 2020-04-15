const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content: String,
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    images: {
        type: [String]
    },
    thread_id: {
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    },
    edit_history: {
        type: [String]
    },
    created_at: {
        type: Number,
        default: new Date().getTime()
    }
});

module.exports = Post = mongoose.model('posts', PostSchema);