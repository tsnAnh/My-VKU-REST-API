const replyController = require("../../controller/reply.controller");

const express = require("express");
const router = express.Router();

const firebaseMiddleware = require("express-firebase-middleware");

const multer = require("multer");
const fs = require("fs-extra");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let dest = req.params.uid;
      let path = "../public/images/" + dest;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      callback(null, path);
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  }),
});

router.get("/get/:post_id", replyController.getPostById);
router.post("/new", firebaseMiddleware.auth, replyController.newPost);
router.post(
  "/upload/:uid",
  firebaseMiddleware.auth,
  upload.single("image"),
  replyController.uploadPostImage
);

module.exports = router;
