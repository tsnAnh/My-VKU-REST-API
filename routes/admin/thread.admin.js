const express = require("express");
const router = express.Router();

//CONTROLLER
const controllerThread = require("../../controller/thread.controller");
const controllerImg = require("../../controller/image.controller");

//MIDDLEWARE
const auth = require("../middleware/auth.middle");
const validator = require("../middleware/validator.middle");

// @route   GET admin/thread/
// @desc    Get all threads
// @access  Private
router.get("/", controllerThread.getAllThreads);

// @route   DELETE admin/thread/
// @desc    Delete all threads
// @access  Private
router.delete("/", controllerThread.deleteAllThreads, controllerImg.deleteAll);

module.exports = router;
