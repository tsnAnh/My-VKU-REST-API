const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    uid: String,
    display_name: String,
    photo_url: String,
    email: String,
    is_email_verified: Boolean,
    provider_id: String,
    threads: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Thread'
        }]
    },
    posts: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }]
    }
});

module.exports = User = mongoose.model('user', UserSchema);