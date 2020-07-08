const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/notification.controller");

//MIDDLEWARE
const auth = require("../middleware/auth.middle");
const validator = require("../middleware/validator.middle");

// @route   GET api/notification
// @desc    Get notification of a user
// @access  Public
router.get(
  "/",
  auth.authGoogle,
  validator.hasUser,
  controller.getNotificationById
);

module.exports = router;
