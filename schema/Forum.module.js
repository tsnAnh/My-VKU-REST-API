const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forumSchema = new Schema({
    title: {
        type: String
    },
    subtitle: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    numberOfThreads: {
        type: Number,
        default: 0
    },
    numberOfReplies: {
        type: Number,
        default: 0
    },
    lastUpdatedOn: {
        type: Number,
        default: new Date().getTime()
    },
    threads: {
        type: [{
            type: Schema.Types.ObjectID,
            ref: 'Thread'
        }]
    }
});

module.exports = Forum = mongoose.model('forum', forumSchema);
