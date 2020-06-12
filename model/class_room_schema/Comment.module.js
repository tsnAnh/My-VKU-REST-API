const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    class_post_id: {
        type: Schema.Types.ObjectId,
        ref: 'ClassPost'
    },
    user_display_name: String,
    user_avatar: String,
    edit_history: [String],
    content: String,
    images: [String],
    created_at: {
        type: Number,
        default: new Date().getTime()
    },
    last_updated_on: {
        type: Number,
        default: new Date().getTime()
    },
});

module.exports = Comment = mongoose.model('comments', commentSchema);