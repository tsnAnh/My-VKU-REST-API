const express = require('express');
const router = express.Router();
const firebaseMiddleware = require('express-firebase-middleware');

const userController = require('../controller/user');

router.get("/:userId", userController.getUser);
router.get("/has-user", userController.hasUser);
router.post("/sign-up", userController.signUp)

module.exports = router;