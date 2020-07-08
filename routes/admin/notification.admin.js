const express = require("express");
const router = express.Router();

//CONTROLLER
const controller = require("../../controller/notification.controller");

//MIDDLEWARE
const auth = require("../middleware/auth.middle");
const validator = require("../middleware/validator.middle");

// @route   GET admin/notification
// @desc    Get all notifications
// @access  Private
router.get("/", controller.getAllNotifications);

// @route   POST admin/notification/:uid
// @desc    Notificate to a user
// @access  Private
router.post("/:uid", controller.alertAttendance);

// @route   DELETE admin/notification
// @desc    Delete all notifications
// @access  Private
router.delete("/", controller.deleteAllNotifications);

module.exports = router;
