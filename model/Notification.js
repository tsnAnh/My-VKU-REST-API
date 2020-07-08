const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  uid: {
    type: String,
    ref: "User"
  },
  createdAt: {
    type: Number,
    default: () => new Date().getTime(),
  },
  message: {
    data: Object,
    notification: Object,
  },
  hasSeen: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Notification", notificationSchema);
