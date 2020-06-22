var upload = require("../../config/multer");
const { ErrorHandler } = require("../../helpers/error");
//HELPERS
const deleteImages = require("../../helpers/deleteImages");

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

//CHECK PERMISSION - check thread hay reply có phải của user đó hay ko
exports.checkPermission = async (req, res, next) => {
  const { user, reply, thread } = req;
  if ((reply && reply.uid != user._id) || (thread && thread.uid != user._id)) {
    next(new ErrorHandler(404, "Not found"));
  }
  next();
};
//CHECK IMAGES
exports.checkFiles = async (req, res, next) => {
  const fieldData = "newImage";
  const maxNumber = 3;

  try {
    upload.array(fieldData, maxNumber)(req, res, async function (err) {
      if (err) {
        next(new ErrorHandler((err.statusCode = 400), err.message));
      }
      req.files = req.files.map((file) => `/images/${file.filename}`);

      //Update reply, must check image nào bị xóa
      if (req.method == "PUT") {
        let { images = [] } = req.reply;
        const updatedImages = req.body.images
          ? JSON.parse(req.body.images)
          : [];
        const deletedImages = [];
        images = images.filter((image) => {
          if (!updatedImages.includes(image)) {
            deletedImages.push(image);
            return false;
          }
          return true;
        });
        if (deletedImages.length > 0) {
          await deleteImages(deletedImages);
        }
        req.body.images = images.concat(req.files);
      }
      //CREATE REPLY
      if (req.method == "POST") {
        req.body.images = req.files;
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};
