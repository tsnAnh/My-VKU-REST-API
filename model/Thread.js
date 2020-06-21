const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
  uid: {
    type: "String",
    ref: "User",
  },
  forumId: {
    type: "String",
    ref: "Forum",
  },
  title: {
    type: String,
  },
  createdAt: {
    type: Number,
    default: new Date().getTime(),
  },
  likes: [
    {
      uid: {
        type: String,
        ref: "User",
      },
    },
  ],

  numberOfViews: {
    type: Number,
    default: 1,
  },
  //Sẽ đc update mỗi lần tạo hoặc xóa reply
  numberOfReplies: {
    type: Number,
    default: 0,
  },
  lastestReply: {
    type: String,
    ref: "Reply",
    default: null,
  },
  //   editHistory: [{}], từ từ làm
});

module.exports = Thread = mongoose.model("Thread", ThreadSchema);
