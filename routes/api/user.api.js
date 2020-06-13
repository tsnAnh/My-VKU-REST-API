const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/user.controller");

//MIDDLEWARE
const auth = require("../middleware/auth.middle");

// @route   GET api/user
// @desc    Load user
// @access  Private
router.get("/", auth.authGoogle, controller.loadUser);

// @route   GET api/user/auth
// @desc    Login or sign up
// @access  Private
router.get("/auth", auth.authGoogle, controller.login);

// ------ADMIN----------
// @route   DELETE api/user/all
// @desc    delete all users
// @access  Public
router.delete("/all", controller.deleteAllUsers);

// @route   GET api/user/all
// @desc    Get all users
// @access  Public
router.get("/all", controller.getAllUsers);

module.exports = router;
