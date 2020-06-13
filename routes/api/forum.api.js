const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/forum.controller");

//MIDDLEWARE
const auth = require("../middleware/auth.middle");

//TODO: thiếu validator

// @route   GET api/forum/
// @desc    Get all forums
// @access  Public
router.get("/", controller.getForums);

// @route   GET api/forum/:idForum
// @desc    Get a specified forum by id
// @access  Public
router.get("/:idForum", controller.getForumById);

// @route   GET api/forum/thread/:idForum
// @desc    Get all threads of speacified forum
// @access  Public
router.get("/thread/:idForum", controller.getAllThreadsOfForum);

// ------------------------ADMIN------------------------

// @route   POST api/forum/
// @desc    Create a forum
// @access  Private
router.post("/", controller.createForum);

// @route   DELETE api/forum/:idForum
// @desc    Delete a forum
// @access  Private
// router.delete("/:idForum", controller.deleteForum);

// @route   DELETE api/forum/all
// @desc    Delete all forums
// @access  Private
router.delete("/all", controller.deleteAllForums);

module.exports = router;
