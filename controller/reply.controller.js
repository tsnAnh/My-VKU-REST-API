const Reply = require("../model/Reply");
const Thread = require("../model/Thread");
const Forum = require("../model/Forum");
const User = require("../model/User");

const mongoose = require("mongoose");
const fs = require("fs-extra");

const getPostById = async (req, res) => {
  try {
    const post = await Reply.findById(req.params.post_id);

    res.json(post);
  } catch (e) {
    throw e;
  }
};

const newPost = async (req, res) => {
  try {
    const requestPost = req.body;

    const timestamp = new Date().getTime();

    const user = await User.findOne({ uid: res.locals.user.uid });

    const post = await Reply.create({
      _id: new mongoose.Types.ObjectId(),
      content: requestPost.content,
      created_at: timestamp,
      user_id: user._id,
      user_display_name: user.display_name,
      images: requestPost.images,
      thread_id: requestPost.thread_id,
      thread_title: requestPost.thread_title,
      user_avatar: user.photo_url,
    });

    if (requestPost.quoted) {
      const quotedPost = await Reply.findOne({ _id: requestPost.quoted });
      await post.updateOne({
        quoted: new mongoose.Types.ObjectId(requestPost.quoted),
        quoted_post: quotedPost,
      });
    }

    const thread = await Thread.findOneAndUpdate(
      { _id: requestPost.thread_id },
      {
        last_updated_on: timestamp,
        $inc: {
          number_of_posts: 1,
        },
        $push: {
          posts: post._id,
        },
      }
    );

    await Forum.findOneAndUpdate(
      { _id: thread.forum_id },
      {
        last_updated_on: timestamp,
        $inc: {
          number_of_posts: 1,
        },
      }
    );

    res.json(post);
  } catch (e) {
    throw e;
  }
};

const uploadPostImage = async (req, res) => {
  try {
    if (req.file) {
      let filename = new Date().valueOf() + "-" + req.file.originalname;
      await fs.rename(req.file.path, req.file.destination + "/" + filename);
      res.json("images" + "/" + res.locals.user.uid + "/" + filename);
    }
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getPostById,
  newPost,
  getPostsByThreadId,
  uploadPostImage,
};
