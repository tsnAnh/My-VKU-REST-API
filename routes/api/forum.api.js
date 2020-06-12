const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/forum.controller");

//MIDDLEWARE
const auth = require("../middleware/auth.middle");

// @route   GET api/forum/
// @desc    Get all forums
// @access  Public
router.get("/", controller.getForums);

// @route   POST api/forum/
// @desc    Create a forum
// @access  Private
router.post("/", controller.createForum);

// @route   GET api/forum/:idForum
// @desc    Get a specified forum by id
// @access  Public
router.get("/:idForum", controller.getForumById);

// @route   GET api/forum/thread/:forumId
// @desc    Get all threads of speacified forum
// @access  Public
router.get("/thread/:forumId", controller.getThreadsByForumId);

module.exports = router;
