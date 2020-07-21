const { body } = require("express-validator");
const path = require("path");

//CONFIG
const upload = require("../../config/multer");

//HELPERS
const validator = require("../../helpers/validate");
const { ErrorHandler } = require("../../helpers/error");

//MODEL
const User = require("../../model/User");
const Thread = require("../../model/Thread");
const Forum = require("../../model/Forum");
const Reply = require("../../model/Reply");

//CHECK USER
exports.hasUser = async (req, res, next) => {
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
exports.hasForum = async (req, res, next) => {
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
exports.hasThread = async (req, res, next) => {
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
exports.hasReply = async (req, res, next) => {
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
//CHECK INPUT - khi create hoặc update
exports.checkInput = (method) => {
  switch (method) {
    case "updateThread":
    case "createThread":
      const title = body(
        "title",
        "Title  must be at least 5 chars long"
      ).isLength({ min: 5 });
      return validator([title]);

    case "newReply":
    case "updateReply":
      const content = body("content", "One of content or images don't exsit");
      const images = body("images").not().isArray({ min: 1 });
      return validator([content.if(images).isLength({ min: 1 })]);
  }
};
//CHECK IMAGES
exports.checkFiles = async (req, res, next) => {
  const fieldData = process.env.fieldData;
  const maxImages = parseInt(process.env.maxImages);

  try {
    upload.array(fieldData, maxImages)(req, res, async function (err) {
      if (err) {
        next(new ErrorHandler((err.statusCode = 400), err.message));
      }
      req.files = req.files
        ? req.files.map((file) => {
            return path.join(req.user._id.toString(), file.filename);
          })
        : [];

      //Use for updating reply, must check image nào bị xóa
      if (req.method == "PUT") {
        let { images = [] } = req.reply;
	console.log(req.body.images);
        const updatedImages = req.body.images
          ? req.body.images
          : [];
        const deletedImages = [];
        if (images && images.length > 0) {
          images = images.filter((image) => {
            if (!updatedImages.includes(image)) {
              deletedImages.push(image);
              return false;
            }
            return true;
          });
        }
        req.body.images = images.concat(req.files);
        req.body.deletedImages = deletedImages;
      }
      //Use for create reply
      if (req.method == "POST") {
        req.body.images = req.files;
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};
