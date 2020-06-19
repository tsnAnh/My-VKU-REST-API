const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forumSchema = new Schema({
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  description: {
    type: String,
  },
  //Mỗi lần có thread  hoặc reply tạo ra hay xóa đi sẽ update thêm vào forum

  lastestThread: {
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
});

module.exports = Forum = mongoose.model("Forum", forumSchema);
