const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/user.controller");

//MIDDLEWARE
const auth = require("../middleware/auth.middle");
const validator = require("../middleware/validator.middle");

// @route   DELETE admin/user/
// @desc    delete all users
// @access  Public
router.delete("/", controller.deleteAllUsers);

// @route   GET admin/user/
// @desc    Get all users
// @access  Public
router.get("/", controller.getAllUsers);

module.exports = router;
