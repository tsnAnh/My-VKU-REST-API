const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/thread.controller");

//MIDDLEWARE
const auth = require("../middleware/auth.middle");
const validator = require("../middleware/validator.middle");

// @route   GET api/thread/reply/:threadId
// @desc    Get all replies of of the thread
// @access  Public
router.get(
  "/reply/:threadId",
  validator.hasThread,
  controller.getAllRepliesOfThread
);

// @route   POST api/thread/:forumId
// @desc    Create a thread
// @access  Private
router.post(
  "/:forumId",
  auth.authGoogle,
  validator.hasUser,
  validator.hasForum,
  validator.checkInput("createThread"),
  controller.createThread
);

// @route   PUT api/thread/:threadId
// @desc    Update a thread
// @access  Private
router.put(
  "/:threadId",
  auth.authGoogle,
  validator.hasUser,
  validator.hasThread,
  validator.checkPermission,
  validator.checkInput("updateThread"),
  controller.updateThread
);

// @route   DELETE api/thread/:threadId
// @desc    Delete a thread
// @access  Private
router.delete(
  "/:threadId",
  auth.authGoogle,
  validator.hasUser,
  validator.hasThread,
  validator.checkPermission,
  controller.deleteThread
);

// @route   GET api/thread/:threadId
// @desc    Get a thread
// @access  Public
router.get("/:threadId", validator.hasThread, controller.getThreadById);

module.exports = router;
