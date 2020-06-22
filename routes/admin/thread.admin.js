const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/thread.controller");

//MIDDLEWARE
const auth = require("../middleware/auth.middle");
const validator = require("../middleware/validator.middle");

// @route   GET admin/thread/
// @desc    Get all threads
// @access  Private
router.get("/", controller.getAllThreads);

// @route   DELETE admin/thread/
// @desc    Delete all threads
// @access  Private
router.delete("/", controller.deleteAllThreads);

module.exports = router;
