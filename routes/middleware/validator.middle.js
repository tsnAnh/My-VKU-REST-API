var upload = require("../../config/multer");
const { ErrorHandler } = require("../../helpers/error");

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
      throw new ErrorHandler(404, "Not found");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

//CHECK FORUM
exports.checkForum = async (req, res, next) => {
  try {
    const forum = await Forum.findById(req.params.forumId);
    if (!forum) {
      throw new ErrorHandler(404, "Not found");
    }
    req.forum = forum;
    next();
  } catch (error) {
    next(error);
  }
};

//CHECK THREAD
exports.checkThread = async (req, res, next) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      throw new ErrorHandler(404, "Not found");
    }
    req.thread = thread;
    next();
  } catch (error) {
    next(error);
  }
};

//CHECK REPLY
exports.checkReply = async (req, res, next) => {
  try {
    const reply = await Reply.findById(req.params.replyId);
    if (!reply) {
      throw new ErrorHandler(404, "Not found");
    }
    req.reply = reply;
    next();
  } catch (error) {
    next(error);
  }
};

//CHECK IMAGES
exports.checkFiles = async (req, res, next) => {
  try {
    upload.array("image", 3)(req, res, function (err) {
      if (err) {
        next(new ErrorHandler((err.statusCode = 400), err.message));
      }
      req.files = req.files.map(
        (file) => `public/images/${req.params.threadId}/${file.filename}`
      );
      next();
    });
  } catch (error) {
    next(error);
  }
};
