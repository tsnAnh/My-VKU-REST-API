const express = require("express");
const router = express.Router();

//CONTROLLER
const controllerForum = require("../../controller/forum.controller");
const controllerImage = require("../../controller/image.controller");

//MIDDLEWARE
const validator = require("../middleware/validator.middle");

// @route   POST admin/forum/
// @desc    Create a forum
// @access  Private
router.post("/", controllerForum.createForum);

// @route   PUT admin/forum/:forumId
// @desc    Update a forum
// @access  Private
router.put("/:forumId", validator.hasForum, controllerForum.updateForum);

// @route   DELETE admin/forum/:forumId
// @desc    Delete a forum
// @access  Private
router.delete("/:forumId", validator.hasForum, controllerForum.deleteForum);

// @route   DELETE admin/forum/
// @desc    Delete all forums
// @access  Private
router.delete("/", controllerForum.deleteAllForums, controllerImage.deleteAll);

module.exports = router;
