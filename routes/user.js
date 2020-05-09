const express = require('express');
const router = express.Router();
const firebaseMiddleware = require('express-firebase-middleware');

const userController = require('../controller/user');

router.get(
    "/is_user_registered",
    firebaseMiddleware.auth,
    userController.getUserByUid
);

router.get("/:user_id", userController.getUserById);

router.post("/new_user", firebaseMiddleware.auth, userController.newUser);

module.exports = router;