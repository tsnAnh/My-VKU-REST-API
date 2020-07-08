const express = require("express");
const router = express.Router();

//MIDDLEWARE
const auth = require("../middleware/auth.middle");
const validator = require("../middleware/validator.middle");

//CONTROLLER
const controllerReply = require("../../controller/reply.controller");
const controllerImg = require("../../controller/image.controller");
const controllerNotification = require("../../controller/notification.controller");

// @route   GET api/reply/:replyId
// @desc    Get a reply
// @access  Public
router.get("/:replyId", validator.hasReply, controllerReply.getReplyById);

// @route   POST api/reply/:threadId
// @desc    Create a reply in a thread
// @access  Private
router.post(
  "/:threadId",
  auth.authGoogle,
  validator.hasUser,
  validator.hasThread,
  validator.checkFiles,
  validator.checkInput("newReply"),
  controllerReply.newReply,
  controllerNotification.alertReplyOnThread
);

// @route   PUT api/reply/:replyId
// @desc    Update a reply
// @access  Private
router.put(
  "/:replyId",
  auth.authGoogle,
  validator.hasUser,
  validator.hasReply,
  validator.checkPermission,
  validator.checkFiles,
  validator.checkInput("updateReply"),
  controllerReply.updateReply
);

// @route   DELETE api/reply/:replyId
// @desc    Delete a reply in a thread
// @access  Private
router.delete(
  "/:replyId",
  auth.authGoogle,
  validator.hasUser,
  validator.hasReply,
  validator.checkPermission,
  controllerReply.deleteReplyOfThread,
  controllerImg.delete
);

// @route   PUT api/reply/like/:replyId
// @desc    Like or unlike a reply
// @access  Private
router.put(
  "/like/:replyId",
  auth.authGoogle,
  validator.hasUser,
  validator.hasReply,
  controllerReply.interactReply,
  controllerNotification.alertLikeReply
);

//-----------ADMIN---------

// @route   GET api/reply/
// @desc    Get all replies
// @access  Private
router.get("/", controllerReply.getAllReplies);

// @route   Delete api/reply/
// @desc    Delete all replies
// @access  Private
router.delete("/", controllerReply.deleteAllReplies, controllerImg.deleteAll);

module.exports = router;
