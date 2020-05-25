const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationChangeSchema = new Schema({
    notification_object_id: {
        type: Schema.Types.ObjectId,
        ref: 'NotificationObject'
    },
    verb: String,
    actor: Schema.Types.ObjectId
});

module.exports = NotificationChange = mongoose.model('notificationChanges', notificationChangeSchema);