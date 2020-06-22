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

module.exports = router;
