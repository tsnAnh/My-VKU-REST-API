const express = require("express");
const router = express.Router();

//MIDDLEWARE
const auth = require("../middleware/auth.middle");
const validator = require("../middleware/validator.middle");

//CONTROLLER
const controller = require("../../controller/reply.controller");

// @route   POST api/reply/:threadId
// @desc    Create a reply in a thread
// @access  Private
router.post(
  "/:threadId",
  auth.authGoogle,
  validator.checkUser,
  validator.checkThread,
  validator.checkFiles,
  controller.newReply
);

//TODO: Khi update chỉ cho ảnh và content, xử lý ảnh update???
// @route   PUT api/reply/:replyId
// @desc    Update a reply
// @access  Private
router.put(
  "/:replyId",
  auth.authGoogle,
  validator.checkUser,
  validator.checkReply,
  validator.checkPermission,
  validator.checkFiles,
  controller.updateReply
);

//TODO: Khi delete reply sẽ xóa ảnh
// xử lý các quoted khi xóa reply
// @route   DELETE api/reply/:replyId
// @desc    Delete a reply in a thread
// @access  Private
router.delete(
  "/:replyId",
  auth.authGoogle,
  validator.checkUser,
  validator.checkReply,
  validator.checkPermission,
  controller.deleteReplyOfThread
);

//-----------ADMIN---------

// @route   GET api/reply/
// @desc    Get all replies
// @access  Private
router.get("/", controller.getAllReplies);

// @route   Delete api/reply/
// @desc    Delete all replies
// @access  Private
router.delete("/", controller.deleteAllReplies);

module.exports = router;
