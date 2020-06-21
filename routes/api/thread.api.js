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
  validator.checkThread,
  controller.getAllRepliesOfThread
);

// @route   POST api/thread/:forumId
// @desc    Create a thread
// @access  Private
router.post(
  "/:forumId",
  auth.authGoogle,
  validator.checkUser,
  validator.checkForum,
  controller.createThread
);

// @route   POST api/thread/:threadId
// @desc    Update a thread
// @access  Private

// @route   DELETE api/thread/:threadId
// @desc    Delete a thread
// @access  Private
router.delete(
  "/:threadId",
  auth.authGoogle,
  validator.checkUser,
  validator.checkThread,
  controller.deleteThread
);

// @route   PUT api/thread/:threadId
// @desc    Like or unlike a thread
// @access  Private
router.put(
  "/:threadId",
  auth.authGoogle,
  validator.checkUser,
  validator.checkThread,
  controller.interactThread
);

//--------------------
//-----------------ÍT DÙNG-------------------------------------------
//-----------------------
// @route   GET api/thread/:threadId
// @desc    Get a thread by id
// @access  Public
router.get("/:threadId", validator.checkThread, controller.getThreadById);

//--------------------
//-----------------ADMIN---------------------------------------------
//-----------------------
// @route   GET api/thread/
// @desc    Get all threads
// @access  Private
router.get("/", controller.getAllThreads);

// @route   GET api/thread/
// @desc    Get all threads
// @access  Private
router.delete("/", controller.deleteAllThreads);
module.exports = router;
