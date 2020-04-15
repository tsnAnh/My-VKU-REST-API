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
    number_of_threads: {
        type: Number,
        default: 0
    },
    number_of_posts: {
        type: Number,
        default: 0
    },
    last_updated_on: {
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

module.exports = Forum = mongoose.model('forums', forumSchema);
