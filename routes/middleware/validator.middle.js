var upload = require("../../config/multer").array("image", 3);

//MODEL
const User = require("../../model/User");
const Thread = require("../../model/Thread");
const Forum = require("../../model/Forum");
const Reply = require("../../model/Reply");

//CHECK USER
exports.checkUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ uidGG: req.userGG.sub });
    if (!user) {
      return res.status(401).json("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json("Server error");
  }
};

//CHECK FORUM
exports.checkForum = async (req, res, next) => {
  try {
    const forum = await Forum.findById(req.params.forumId);
    if (!forum) {
      return res.status(404).json("Forum not found");
    }
    req.forum = forum;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json("Server error");
  }
};

//CHECK THREAD
exports.checkThread = async (req, res, next) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).json("Thread not found");
    }
    req.thread = thread;
    next();
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(404).json(null);
    }
    //TODO: Fix bắt lỗi, nên thêm ở cuối endpoint ko???
    console.log(error);
    return res.status(500).json("Server error");
  }
};

//CHECK REPLY
exports.checkReply = async (req, res, next) => {
  try {
    const reply = await Reply.findById(req.params.replyId);
    if (!reply) {
      return res.status(404).json("Reply not found");
    }
    req.reply = reply;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json("Server error");
  }
};

//CHECK IMAGES
exports.checkFiles = async (req, res, next) => {
  try {
    upload(req, res, function (err) {
      if (err) {
        return res.status(401).json("Upload image fail");
      }
      req.files = req.files.map(
        (file) => `public/images/${req.params.threadId}/${file.filename}`
      );
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Server error");
  }
};
