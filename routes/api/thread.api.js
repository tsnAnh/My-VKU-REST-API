const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/thread.controller");

//MIDDLEWARE
const auth = require("../../controller/forum.controller");

// @route   GET api/thread/:idThread
// @desc    Get a thread by id
// @access  Public
router.get("/:idThread", controller.getThreadById);

// @route   POST api/thread/
// @desc    Create a thread
// @access  Private
router.post("/", controller.createThread);

// @route   GET api/thread/reply/:idThread
// @desc    Get all replies of of speacified thread
// @access  Public
router.get("/reply/:idThread", controller.getRepliesByThreadId);

module.exports = router;
