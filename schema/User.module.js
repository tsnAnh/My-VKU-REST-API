const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    uid: String,
    displayName: String,
    photoUrl: String,
    email: String,
    emailVerified: Boolean,
    numberOfThreads: {
        type: Number,
        default: 0
    },
    threads: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Thread"
        }],
        default: []
    },
    replies: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Reply"
        }],
        default: []
    },
    role: Number
});

module.exports = mongoose.model("user", UserSchema);