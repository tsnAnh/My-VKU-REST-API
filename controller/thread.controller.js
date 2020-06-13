const mongoose = require("mongoose");
const ObjectId = require("mongoose");

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
      { _id: req.params.idThread },
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
      return res.status(401).json(null);
    }
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

// GET ALL REPLIES OF A THREAD
controller.getAllRepliesOfThread = async (req, res) => {
  const idThread = req.params.idThread;
  const { page = 1, limit = 10 } = req.query;

  try {
    const thread = await Thread.findById(idThread);
    if (!thread) {
      return res.status(401).json(null);
    }
    const replies = await Reply.find({ idThread })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({
        created_at: 1,
      })
      .exec();

    const count = await Reply.countDocuments();

    res.json({
      replies,
      totalPages: Math.ceil(count / limit),
      currentPage: page * 1,
    });
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(401).json(null);
    }
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

// CREATE THREAD
controller.createThread = async (req, res) => {
  const idForum = req.params.idForum;
  const { title } = req.body;

  try {
    const user = await User.findOne({ uidGG: req.userGG.sub });
    const forum = await Forum.findById(idForum);
    if (!user || !forum) {
      return res.status(401).json(null);
    }
    const newThread = new Thread({
      uid: user._id,
      title: title,
      idForum: idForum,
    });
    await newThread.save();

    //Update lastUpdatedAt và numberOfThread
    await Forum.findOneAndUpdate(
      { _id: idForum },
      { lastUpdatedAt: newThread.createdAt, $inc: { numberOfThreads: 1 } }
    );
    res.json(newThread);
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(401).json(null);
    }
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//DELETE
controller.deleteThread = async (req, res) => {
  const idThread = req.params.idThread;

  try {
    const user = await User.findOne({ uidGG: req.userGG.sub });
    const thread = await Thread.findById(idThread);
    //Check if the thread is owned by that user
    if (!user || !thread || thread.uid != user._id) {
      return res.status(401).json(null);
    }
    await Thread.deleteOne({ _id: idThread });
    res.json("deleted that thread");
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(401).json(null);
    }
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = controller;
