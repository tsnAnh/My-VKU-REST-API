const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
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
    thread_number: {
        type: Number,
        default: 0
    },
    post_number: {
        type: Number,
        default: 0
    },
    last_updated_on: {
        type: Date,
        default: Date.now()
    },
    slug: {
        type: String
    },
    threads: {
        type: [{
            type: Schema.Types.ObjectID,
            ref: 'Thread'
        }]
    }
});

module.exports = Forum = mongoose.model('forums', forumSchema);
