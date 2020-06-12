const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classPostSchema = new Schema({
    class_id: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    likes: {
        type: Number,
        default: 0
    },
    number_of_comments: {
        type: Number,
        default: 0
    },
    number_of_shares: {
        type: Number,
        default: 0
    },
    is_announcement: Boolean,
    pinned: Boolean,
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
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    edit_history: [String]
});

module.exports = ClassPost = mongoose.model('classposts', classPostSchema);