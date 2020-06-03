const express = require('express');
const router = express.Router();
const firebaseMiddleware = require('express-firebase-middleware');

const userController = require('../controller/user');

router.get("/:userId", userController.getUser);
router.post("/has-user", userController.hasUser);
router.post("/sign-up", firebaseMiddleware.auth, userController.signUp)

module.exports = router;