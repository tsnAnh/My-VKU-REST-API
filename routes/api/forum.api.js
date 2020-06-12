const express = require("express");
const router = express.Router();

const forumController = require("../../controller/forum.controller");

// @route   GET api/forum/
// @desc    Get all forums
// @access  Public
router.get("/", forumController.getForums);

// @route   POST api/forum/
// @desc    Create a forum
// @access  Private
router.post("/", forumController.createForum);

// @route   GET api/forum/:idForum
// @desc    Get
// @access  Private
router.get("/:idForum", forumController.getForumById);

module.exports = router;
