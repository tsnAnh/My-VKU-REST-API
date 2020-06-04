const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");

router.get("/:userId", userController.getUser);
router.post("/has-user", userController.loadUser);
// router.post("/sign-up", firebaseMiddleware.auth, userController.signUp)

module.exports = router;
