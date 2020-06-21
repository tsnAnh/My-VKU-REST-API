const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  uid: {
    type: String,
    ref: "User",
  },
  threadId: {
    type: String,
    ref: "Thread",
  },
  forumId: {
    type: String,
    ref: "Forum",
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Number,
    default: new Date().getTime(),
  },
  quoted: {
    type: String,
  },
  images: [String],

  //   editHistory: [{
  // }], từ từ làm
});

module.exports = Reply = mongoose.model("Reply", ReplySchema);
