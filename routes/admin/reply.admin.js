const express = require("express");
const router = express.Router();

//MIDDLEWARE
const auth = require("../middleware/auth.middle");
const validator = require("../middleware/validator.middle");

//CONTROLLER
const controller = require("../../controller/reply.controller");

// @route   GET admin/reply/
// @desc    Get all replies
// @access  Private
router.get("/", controller.getAllReplies);

// @route   Delete admin/reply/
// @desc    Delete all replies
// @access  Private
router.delete("/", controller.deleteAllReplies);

module.exports = router;
