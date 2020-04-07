const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content: String,
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
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
        type: Date,
        default: Date.now()
    }
});

module.exports = Post = mongoose.model('posts', PostSchema);