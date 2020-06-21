const mongoose = require("mongoose");

//MODEL
const Thread = require("../model/Thread");
const User = require("../model/User");
const Forum = require("../model/Forum");
const Reply = require("../model/Reply");

const controller = {};

//GET INFO OF A THREAD
controller.getThreadById = async (req, res, next) => {
  const thread = req.thread;
  try {
    const threadUpdated = await Thread.findOneAndUpdate(
      { _id: thread._id },
      {
        $inc: {
          numberOfViews: 1,
        },
      },
      {
        new: true,
      }
    );

    res.json(threadUpdated);
  } catch (error) {
    next(error);
  }
};

// GET ALL REPLIES OF A THREAD
controller.getAllRepliesOfThread = async (req, res, next) => {
  const thread = req.thread;
  const { page = 1, limit = 10 } = req.query;

  try {
    const replies = await Reply.find({ threadId: thread._id })
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
    next(error);
  }
};

// CREATE THREAD
controller.createThread = async (req, res, next) => {
  const { forum, user } = req;
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
    next(error);
  }
};

//DELETE A THREAD
controller.deleteThread = async (req, res, next) => {
  const { thread, user } = req;
  try {
    //Check if the thread is owned by that user
    if (thread.uid != user._id) {
      throw new ErrorHandler(403, "Don not have access");
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
        lastestThread: threads.length > 0 ? threads[0]._id : null,
      }
    );
    res.json("deleted thread");
  } catch (error) {
    next(error);
  }
};

//LIKE OR UNLIKE THREAD
controller.interactThread = async (req, res, next) => {
  const { user, thread } = req;
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
  } catch (error) {
    next(error);
  }
};

// --------------------ADMIN------------------
controller.getAllThreads = async (req, res, next) => {
  try {
    const threads = await Thread.find();
    res.json(threads);
  } catch (error) {
    next(error);
  }
};
controller.deleteAllThreads = async (req, res, next) => {
  try {
    await Thread.deleteMany();
    await Reply.deleteMany();
    res.json("Deleted all threads");
  } catch (error) {
    next(error);
  }
};
module.exports = controller;
