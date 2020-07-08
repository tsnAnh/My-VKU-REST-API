const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  uid: {
    type: String,
    ref: "User",
    required: true,
  },
  threadId: {
    type: String,
    ref: "Thread",
    required: true,
  },
  forumId: {
    type: String,
    ref: "Forum",
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Number,
    default: () => new Date().getTime(),
  },
  quoted: {
    isDeleted: Boolean,
    replyId: {
      type: String,
      ref: "Reply",
    },
  },
  images: [String],
  likes: [
    {
      uid: {
        type: String,
        ref: "User",
      },
    },
  ],

  //   editHistory: [{
  // }], từ từ làm
});

module.exports = Reply = mongoose.model("Reply", ReplySchema);
