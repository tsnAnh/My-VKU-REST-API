const mongoose = require("mongoose");

//MODEL
const Reply = require("../model/Reply");
const Thread = require("../model/Thread");
const Forum = require("../model/Forum");

const controller = {};

//CREATE A NEW REPLY
controller.newReply = async (req, res, next) => {
  const { content, quoted } = req.body;
  const { user, thread, files: images } = req;
  try {
    const newReply = new Reply({
      uid: user._id,
      threadId: thread._id,
      forumId: thread.forumId,
      content,
      images,
    });
    //Check if quoted exsit and is in the thread
    const quotedReply = await Reply.findOne({
      _id: quoted,
      threadId: thread._id,
    });

    if (quotedReply) {
      newReply.quoted = quoted;
    }

    await newReply.save();

    //Update Thread and Forum
    const repliesOfThread = await Reply.find({ threadId: thread._id }).sort({
      _id: -1,
    });
    await Thread.findOneAndUpdate(
      { _id: thread._id },
      {
        lastUpdatedOn: repliesOfThread[0].createdAt,
        numberOfReplies: repliesOfThread.length,
      }
    );
    const repliesOfForum = await Reply.find({ forumId: thread.forumId });
    await Forum.findOneAndUpdate(
      { _id: thread.forumId },
      {
        numberOfReplies: repliesOfForum.length,
      }
    );

    res.json(newReply);
  } catch (error) {
    next(error);
  }
};

//UPDATE A REPY
controller.updateReply = async (req, res, next) => {
  const { reply } = req;
  const { files: images } = req;
  const { content } = req.body;

  try {
    //Update lastestreply và numberOfreply of Forum
    const replyUpdated = await Reply.findOneAndUpdate(
      { _id: reply._id },
      {
        content,
        images,
      },
      {
        new: true,
      }
    );

    res.json(replyUpdated);
  } catch (error) {
    next(error);
  }
};

//DELETE A REPLY
controller.deleteReplyOfThread = async (req, res, next) => {
  const { reply } = req;

  try {
    await Reply.deleteOne({ _id: reply._id });

    //Update Thread and Forum
    const replies = await Reply.find({ threadId: reply.threadId }).sort({
      _id: -1,
    });
    await Thread.findOneAndUpdate(
      { _id: reply.threadId },
      {
        lastUpdatedOn: replies[0].createdAt,
        numberOfReplies: replies.length,
      }
    );
    await Forum.findOneAndUpdate(
      { _id: reply.forumId },
      {
        numberOfReplies: replies.length,
      }
    );
    res.json("Delted reply");
  } catch (error) {
    next(error);
  }
};

//-----------ADMIN------------
controller.getAllReplies = async (req, res) => {
  try {
    const replies = await Reply.find();
    res.json(replies);
  } catch (error) {
    next(error);
  }
};

controller.deleteAllReplies = async (req, res) => {};

module.exports = controller;
