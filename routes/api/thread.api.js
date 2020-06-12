const express = require("express");
const router = express.Router();

const threadController = require("../../controller/thread.controller");
const firebaseMiddleware = require("express-firebase-middleware");

// @route   PUT api/cards/:id
// @desc    Update card
// @access  Private
router.get("/create", function (req, res) {
  res.send("Hello There");
});

router.post("/create", firebaseMiddleware.auth, threadController.newThread);

router.get("/:forum_id", threadController.getThreadsByForumId);

router.get("/get/:thread_id", threadController.getThreadById);

module.exports = router;
