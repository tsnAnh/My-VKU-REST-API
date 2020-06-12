const mongoose = require("mongoose");

//MODEL
const Thread = require("../model/Thread");
const User = require("../model/User");
const Forum = require("../model/Forum");
const Post = require("../model/Reply");

const controller = {};

//GET INFO OF A THREAD
controller.getThreadById = async (req, res) => {
  try {
    const thread = await Thread.findOneAndUpdate(
      { _id: req.params.thread_id },
      {
        $inc: {
          number_of_views: 1,
        },
      }
    );

    res.json(thread);
  } catch (e) {
    throw e;
  }
};

// GET ALL REPLIES OF A THREAD
controller.getRepliesByThreadId = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const posts = await Reply.find({ thread_id: req.params.thread_id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({
        created_at: 1,
      })
      .exec();

    const count = await Reply.countDocuments();

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page * 1,
    });
  } catch (e) {
    res.json({
      status: "error",
      msg: e,
    });
    throw e;
  }
};

// CREATE THREAD
controller.createThread = async (req, res) => {
  const userGG = req.userGG;

  try {
    const user = await User.findOne({ uidGG: userGG["sub"] });
    const requestThread = req.body.thread;
    const requestPost = req.body.post;

    const userId = user._id;

    const timestamp = new Date().getTime();
    console.log("Timestamp: ", timestamp);
    //TODO: CREATE THREAD
    const thread = new Thread({
      _id: new mongoose.Types.ObjectId(),
      title: requestThread.title,
      image: requestThread.image,
      forum_id: requestThread.forum_id,
      user_id: userId,
      user_avatar: user.photo_url,
      user_display_name: user.display_name,
      last_updated_on: timestamp,
      created_at: timestamp,
    });

    await thread.save(async (error) => {
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
            last_updated_on: timestamp,
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
};

module.exports = controller;
