const mongoose = require("mongoose");

//MODEL
const Thread = require("../model/Thread");
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
      })
      .populate("quoted.replyId")
      .populate("uid")
      .populate("likes.uid");

    const count = await Reply.find({ threadId: thread._id }).countDocuments();

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

    //Update latestThread và numberOfThread of Forum
    const threads = await Thread.find({ forumId: forum._id });
    await Forum.findOneAndUpdate(
      { _id: forum._id },
      {
        latestThread: newThread._id.toString(),
        numberOfThreads: threads.length,
      }
    );
    res.json(newThread);
  } catch (error) {
    next(error);
  }
};

// UPDATE THREAD
controller.updateThread = async (req, res, next) => {
  const { thread } = req;
  const { title } = req.body;

  try {
    //Update latestThread và numberOfThread of Forum
    const threadUpdated = await Thread.findOneAndUpdate(
      { _id: thread._id },
      {
        title,
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

//DELETE A THREAD
controller.deleteThread = async (req, res, next) => {
  const { thread } = req;
  try {
    await Thread.deleteOne({ _id: thread._id });
    await Reply.deleteMany({ threadId: thread._id });

    //Update numberOfThreads and latestThread in the Forum
    const threads = await Thread.find({ forumId: thread.forumId }).sort({
      _id: -1,
    });
    const replies = await Reply.find({ forumId: thread.forumId });
    await Forum.findOneAndUpdate(
      { _id: thread.forumId },
      {
        numberOfReplies: replies.length,
        numberOfThreads: threads.length,
        latestThread: threads.length > 0 ? threads[0]._id : null,
      }
    );
    res.json("deleted thread");
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
    await Forum.updateMany(
      {},
      {
        latestThread: null,
        numberOfThreads: 0,
        numberOfReplies: 0,
      }
    );
    res.json("Deleted all threads");
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = controller;
