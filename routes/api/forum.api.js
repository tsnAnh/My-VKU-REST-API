const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/forum.controller");

//MIDDLEWARE
const validator = require("../middleware/validator.middle");

//TODO: Thiếu check input khi create
// @route   GET api/forum/
// @desc    Get all forums
// @access  Public
router.get("/", controller.getAllForums);

// @route   GET api/forum/:forumId
// @desc    Get a specified forum by id
// @access  Public
router.get("/:forumId", validator.checkForum, controller.getForumById);

// @route   GET api/forum/thread/:forumId
// @desc    Get all threads of speacified forum
// @access  Public
router.get(
  "/thread/:forumId",
  validator.checkForum,
  controller.getAllThreadsOfForum
);

// ------------------------ADMIN------------------------

// @route   POST api/forum/
// @desc    Create a forum
// @access  Private
router.post("/", controller.createForum);

// @route   PUT api/forum/:forumId
// @desc    Update a forum
// @access  Private
router.put("/:forumId", validator.checkForum, controller.updateForum);

// @route   DELETE api/forum/:forumId
// @desc    Delete a forum
// @access  Private
router.delete("/:forumId", validator.checkForum, controller.deleteForum);

// @route   DELETE api/forum/
// @desc    Delete all forums
// @access  Private
router.delete("/", controller.deleteAllForums);

module.exports = router;
