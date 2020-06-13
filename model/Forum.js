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
  image: {
    type: String,
  },
  //Mỗi lần có thread  hoặc reply tạo ra sẽ update thêm vào forum
  lastUpdatedAt: {
    type: Number,
    default: new Date().getTime(),
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

module.exports = Forum = mongoose.model("forum", forumSchema);
