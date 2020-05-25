const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationObjectSchema = new Schema({
    notification_id: {
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    },
    object: Schema.Types.Mixed,
    notification_changes: [{
        type: Schema.Types.ObjectId,
        ref: 'NotificationChange'
    }],
    status: Boolean
});

module.exports = NotificationObject = mongoose.model('notificationObject', notificationObjectSchema);