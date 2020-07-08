const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forumSchema = new Schema({
  title: {
    type: String,
  },
  tag: {
    type: String,
  },
  //Mỗi lần có thread  hoặc reply tạo ra hay xóa đi sẽ update thêm vào forum
  latestThread: {
    type: String,
    ref: "Thread",
    default: null,
  },
  numberOfThreads: {
    type: Number,
    default: 0,
  },
  numberOfReplies: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: () => new Date().getTime(),
  },
});

module.exports = Forum = mongoose.model("Forum", forumSchema);
