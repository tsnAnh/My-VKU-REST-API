const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/thread.controller");

//MIDDLEWARE
const auth = require("../middleware/auth.middle");

// @route   GET api/thread/:idThread
// @desc    Get a thread by id
// @access  Public
router.get("/:idThread", controller.getThreadById);

// @route   GET api/thread/reply/:idThread
// @desc    Get all replies of of the thread
// @access  Public
router.get("/reply/:idThread", controller.getAllRepliesOfThread);

// @route   POST api/thread/:idForum
// @desc    Create a thread
// @access  Private
router.post("/:idForum", auth.authGoogle, controller.createThread);

// @route   DELETE api/thread/:idThread
// @desc    Edit a thread
// @access  Private

// @route   DELETE api/thread/:idThread
// @desc    Delete a thread
// @access  Private
router.delete("/:idThread", auth.authGoogle, controller.deleteThread);

module.exports = router;
