const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/token.controller");

//MIDDLEWARE
const auth = require("../middleware/auth.middle");
const validator = require("../middleware/validator.middle");

// @route   GET admin/token
// @desc    Get all tokens
// @access  Public
router.get("/", controller.getAllTokens);

module.exports = router;
