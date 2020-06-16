const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/thread.controller");

//MIDDLEWARE
const auth = require("../middleware/auth.middle");

// @route   GET api/thread/:threadId
// @desc    Get a thread by id
// @access  Public
router.get("/:threadId", controller.getThreadById);

// @route   GET api/thread/reply/:threadId
// @desc    Get all replies of of the thread
// @access  Public
router.get("/reply/:threadId", controller.getAllRepliesOfThread);

// @route   POST api/thread/:forumId
// @desc    Create a thread
// @access  Private
router.post("/:forumId", auth.authGoogle, controller.createThread);

// @route   POST api/thread/:threadId
// @desc    Edit a thread
// @access  Private

// @route   DELETE api/thread/:threadId
// @desc    Delete a thread
// @access  Private
router.delete("/:threadId", auth.authGoogle, controller.deleteThread);

// @route   PUT api/thread/:threadId
// @desc    Like or unlike a thread
// @access  Private
router.put("/:threadId", auth.authGoogle, controller.interactThread);

// -------ADMIN-----------
// @route   GET api/thread/all
// @desc    Get all threads
// @access  Private
router.get("/", controller.getAllThreads);

module.exports = router;
