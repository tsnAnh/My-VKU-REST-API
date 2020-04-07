const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    title: {
        type: String
    },
    forum_id: {
        type: Schema.Types.ObjectId,
        ref: 'Forum'
    },
    user_display_name: String,
    user_avatar: String,
    number_of_posts: {
        type: Number,
        default: 1
    },
    number_of_views: {
        type: Number,
        default: 0
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
    posts: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }],
        default: []
    },
    edit_history: {
        type: [String],
        default: []
    }
});

module.exports = Thread = mongoose.model('threads', ThreadSchema);