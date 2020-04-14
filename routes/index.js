const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Thread = require("../schema/Thread.module");
const User = require("../schema/User.module");
const Forum = require("../schema/Forum.module");
const Post = require("../schema/Post.module");

const firebaseMiddleware = require("express-firebase-middleware");
const multer = require("multer");
const { ObjectID } = require("mongodb");
const admin = require("firebase-admin");

const fs = require("fs-extra");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let dest = req.params.uid;
      let path = '../public/images/' + dest;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      callback(null, path);
    },
    filename: (req, file, callback) => {
      console.log(file);
      callback(null, file.originalname);
    }
  })
});

router.get(
  "/user/is_user_registered",
  firebaseMiddleware.auth,
  async (req, res) => {
    const user = await User.findOne({ uid: res.locals.user.uid });
    if (user != null) {
      res.json(true);
    } else {
      res.json(false);
    }
  }
);

router.post("/uploads", upload.any(), async (req, res) => {
  try {
    res.json("/uploads" + req.file.filename);
  } catch (e) {
    throw e;
  }
});

router.get("/user/:user_id", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.user_id,
    });

    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(400).json("error");
    throw e;
  }
});

router.post("/user/new_user", firebaseMiddleware.auth, async (req, res) => {
  try {
    admin
      .auth()
      .getUser(res.locals.user.uid)
      .then((userRecord) => {
        console.log(userRecord);
        User.create({
          uid: userRecord.uid,
          display_name: userRecord.displayName,
          photo_url: userRecord.photoURL,
          email: userRecord.email,
          is_user_verified: userRecord.emailVerified,
        });

        res.json("success");
      });
  } catch (e) {
    console.error(e);
    res.json("error");
    throw e;
  }
});
router.get("/t/create", function (req, res) {
  res.send("Hello There");
});
router.post(
  "/t/create",
  firebaseMiddleware.auth,
  async (req, res, next) => {
    const user = await User.findOne({ uid: res.locals.user.uid });
    res.locals.dbUser = user;
    next();
  },
  async (req, res) => {
    try {
      const requestThread = req.body.thread;
      const requestPost = req.body.post;
      const userId = res.locals.dbUser._id;

      const thread = new Thread({
        _id: new mongoose.Types.ObjectId(),
        title: requestThread.title,
        image: requestThread.image,
        forum_id: requestThread.forum_id,
        user_id: userId,
        user_avatar: res.locals.dbUser.photo_url,
        user_display_name: res.locals.dbUser.display_name,
      });

      const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        content: requestPost.content,
        user_id: userId,
        thread_id: thread._id,
        images: requestPost.images
      });
      console.log(post);

      thread.save(async (error) => {
        if (error) {
          throw error;
        }
        try {
          await Forum.findOneAndUpdate(
            { _id: requestThread.forum_id },
            {
              $inc: {
                number_of_posts: 1,
                number_of_threads: 1,
              },
              $push: {
                threads: thread._id,
              },
              last_updated_on: Date.now(),
            }
          );
          await User.findOneAndUpdate(
            { _id: userId },
            {
              $inc: {
                number_of_threads: 1,
              },
              $push: {
                threads: thread._id,
                posts: post._id,
              },
            }
          );
          await thread.updateOne({
            $push: {
              posts: post._id,
            },
          });
          await post.save();
        } catch (e) {
          throw e;
        }
      });

      res.json(thread);
    } catch (e) {
      console.log(e);
      res.status(400).json("Something went wrong");
      throw e;
    }
  }
);

router.get('/r/:thread_id', async (req, res) => {
  try {
    const posts = await Post.find({ thread_id: req.params.thread_id });
    res.json({ posts: posts });
  } catch (e) {
    throw e;
  }
});

router.post('/r/upload/:uid', firebaseMiddleware.auth, upload.single("image"), async (req, res) => {
  try {
    console.log(req.file);
    if (req.file) {
      let filename = (new Date).valueOf() + "-" + req.file.originalname;
      await fs.rename(req.file.path, req.file.destination + "/" + filename);
      console.log("images" + "/" + res.locals.user.uid + "/" + filename);
      res.json("images" + "/" + res.locals.user.uid + "/" + filename);
    }
  } catch (e) {
    throw e;
  }
});

module.exports = router;
