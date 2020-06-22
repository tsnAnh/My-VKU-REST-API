const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/user.controller");

//MIDDLEWARE
const auth = require("../middleware/auth.middle");
const validator = require("../middleware/validator.middle");

// @route   GET api/user
// @desc    Load an user
// @access  Private
router.get("/", auth.authGoogle, validator.checkUser, controller.loadUser);

// @route   GET api/user/auth
// @desc    Login or sign up
// @access  Private
router.get("/auth", auth.authGoogle, controller.login);

module.exports = router;
