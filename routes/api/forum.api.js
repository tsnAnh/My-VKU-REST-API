const express = require("express");
const router = express.Router();

//CONTROLLER
const controllerForum = require("../../controller/forum.controller");

//MIDDLEWARE
const validator = require("../middleware/validator.middle");

// @route   GET api/forum/
// @desc    Get all forums
// @access  Public
// @return forums [Forum]
router.get("/", controllerForum.getAllForums);

// @route   GET api/forum/:forumId
// @desc    Get a specified forum by id
// @access  Public
router.get("/:forumId", validator.hasForum, controllerForum.getForumById);

// @route   GET api/forum/thread/:forumId
// @desc    Get all threads of speacified forum
// @access  Public
router.get(
  "/thread/:forumId",
  validator.hasForum,
  controllerForum.getAllThreadsOfForum
);

module.exports = router;
