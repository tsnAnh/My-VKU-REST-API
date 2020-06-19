const mongoose = require("mongoose");

//MODEL
const Thread = require("../model/Thread");
const User = require("../model/User");
const Forum = require("../model/Forum");
const Reply = require("../model/Reply");

const controller = {};

//GET INFO OF A THREAD
controller.getThreadById = async (req, res) => {
  try {
    const thread = await Thread.findOneAndUpdate(
      { _id: req.params.threadId },
      {
        $inc: {
          numberOfViews: 1,
        },
      },
      {
        new: true,
      }
    );

    res.json(thread);
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(404).json(null);
    }
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

// GET ALL REPLIES OF A THREAD
controller.getAllRepliesOfThread = async (req, res) => {
  const threadId = req.thread._id;
  const { page = 1, limit = 10 } = req.query;

  try {
    const replies = await Reply.find({ threadId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({
        created_at: 1,
      });

    const count = await Reply.countDocuments();

    res.json({
      replies,
      totalPages: Math.ceil(count / limit),
      currentPage: page * 1,
    });
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(404).json(null);
    }
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

// CREATE THREAD
controller.createThread = async (req, res) => {
  const forum = req.forum;
  const user = req.user;
  const { title } = req.body;

  try {
    const newThread = await Thread.create({
      uid: user._id,
      title: title,
      forumId: forum._id,
    });

    //Update lastestThread và numberOfThread of Forum
    const threads = await Thread.find({ forumId: forum._id });
    await Forum.findOneAndUpdate(
      { _id: forum._id },
      {
        lastestThread: newThread._id.toString(),
        numberOfThreads: threads.length,
      }
    );
    res.json(newThread);
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(404).json(null);
    }
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//DELETE A THREAD
controller.deleteThread = async (req, res) => {
  const thread = req.thread;
  const user = req.user;
  try {
    //Check if the thread is owned by that user
    if (thread.uid != user._id) {
      return res.status(404).json(null);
    }
    await Thread.deleteOne({ _id: thread._id });

    //Update numberOfThreads and lastestThread in the Forum
    const threads = await Thread.find({ forumId: thread.forumId }).sort({
      _id: -1,
    });
    await Forum.findOneAndUpdate(
      { _id: thread.forumId },
      {
        numberOfThreads: threads.length > 0 ? threads.length : 0,
        lastestThread: threads.length > 0 ? threadthreads[0]._id : 0,
      }
    );
    res.json("deleted thread");
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(404).json(null);
    }
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//LIKE OR UNLIKE THREAD
controller.interactThread = async (req, res) => {
  const thread = req.thread;
  const user = req.user;
  try {
    //check if the Thread has already been liked
    const removeIndex = thread.likes.findIndex((like) => like.uid == user._id);
    if (removeIndex > -1) {
      //Unlike
      thread.likes.splice(removeIndex, 1);
    } else {
      // Like a Thread
      thread.likes.unshift({ uid: user._id });
    }

    await thread.save();
    res.json(thread.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json(null);
    }
    res.status(500).send("Server Error");
  }
};

// --------------------ADMIN------------------
controller.getAllThreads = async (req, res) => {
  try {
    const threads = await Thread.find();
    res.json(threads);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json(null);
    }
    res.status(500).send("Server Error");
  }
};
controller.deleteAllThreads = async (req, res) => {
  try {
    await Thread.deleteMany();
    await Reply.deleteMany();
    res.json("Deleted all threads");
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json(null);
    }
    res.status(500).send("Server Error");
  }
};
module.exports = controller;
