const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/forum.controller");

//MIDDLEWARE
const validator = require("../middleware/validator.middle");

// @route   POST admin/forum/
// @desc    Create a forum
// @access  Private
router.post("/", controller.createForum);

// @route   PUT admin/forum/:forumId
// @desc    Update a forum
// @access  Private
router.put("/:forumId", validator.checkForum, controller.updateForum);

// @route   DELETE admin/forum/:forumId
// @desc    Delete a forum
// @access  Private
router.delete("/:forumId", validator.checkForum, controller.deleteForum);

// @route   DELETE admin/forum/
// @desc    Delete all forums
// @access  Private
router.delete("/", controller.deleteAllForums);

module.exports = router;
