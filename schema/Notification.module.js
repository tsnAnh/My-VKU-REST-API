const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    notification_objects: [{
        type: Schema.Types.ObjectId,
        ref: 'NotificationObject'
    }],
    has_new_notification: Boolean
});

module.exports = Notification = mongoose.model('notifications', NotificationSchema);