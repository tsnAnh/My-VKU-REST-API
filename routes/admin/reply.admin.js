const express = require("express");
const router = express.Router();

//MIDDLEWARE
const auth = require("../middleware/auth.middle");
const validator = require("../middleware/validator.middle");

//CONTROLLER
const controllerReply = require("../../controller/reply.controller");
const controllerImage = require("../../controller/image.controller");

// @route   GET admin/reply/
// @desc    Get all replies
// @access  Private
router.get("/", controllerReply.getAllReplies);

// @route   Delete admin/reply/
// @desc    Delete all replies
// @access  Private
router.delete("/", controllerReply.deleteAllReplies, controllerImage.deleteAll);

module.exports = router;
