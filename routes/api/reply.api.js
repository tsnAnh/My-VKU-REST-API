const express = require("express");
const router = express.Router();

const uploadImg = require("../../config/multer");
//MIDDLEWARE
const auth = require("../middleware/auth.middle");
const checkImg = require("../middleware/checkImage.middle");
//CONTROLLER
const controller = require("../../controller/reply.controller");
//TODO: chưa test checkImg, xử lý file, nếu user up file thì sao??
// @route   POST api/reply/:threadId
// @desc    Make a reply in a thread
// @access  Private
router.post("/:threadId", auth.authGoogle, checkImg, controller.newReply);

// @route   DELETE api/reply/:threadId
// @desc    Delete a reply in a thread
// @access  Private

module.exports = router;
