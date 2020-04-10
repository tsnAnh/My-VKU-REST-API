const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    uid: String,
    display_name: String,
    photo_url: String,
    email: String,
    is_email_verified: Boolean,
    number_of_threads: {
        type: Number,
        default: 0,
    },
    threads: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Thread'
        }],
        default: []
    },
    posts: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }],
        default: []
    }
});

module.exports = User = mongoose.model('users', UserSchema);