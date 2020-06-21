const mongoose = require("mongoose");
//MODEL
const Reply = require("../model/Reply");
const Thread = require("../model/Thread");
const Forum = require("../model/Forum");

const controller = {};

//CREATE A NEW REPLY
controller.newReply = async (req, res, next) => {
  let { content, quoted } = req.body;
  const { user, thread, files: images } = req;
  try {
    //Check if quoted exsit and is in the thread
    const quotedReply = await Reply.findOne({
      _id: quoted,
      threadId: thread._id,
    });
    if (quotedReply) {
      quoted = {
        replyId: quoted,
      };
    }
    const newReply = new Reply({
      uid: user._id,
      threadId: thread._id,
      forumId: thread.forumId,
      content,
      quoted,
      images,
    });

    await newReply.save();

    //Update Thread and Forum
    const repliesOfThread = await Reply.find({ threadId: thread._id }).sort({
      _id: -1,
    });
    await Thread.findOneAndUpdate(
      { _id: thread._id },
      {
        lastestReply:
          repliesOfThread.length > 0 ? repliesOfThread[0]._id : null,
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

//UPDATE A REPLY
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

    //Update Thread, Forum and Reply quoted
    const repliesOfThread = await Reply.find({ threadId: reply.threadId }).sort(
      {
        _id: -1,
      }
    );
    await Thread.findOneAndUpdate(
      { _id: reply.threadId },
      {
        lastestReply:
          repliesOfThread.length > 0 ? repliesOfThread[0]._id : null,
        numberOfReplies: repliesOfThread.length,
      }
    );
    const repliesOfForum = await Reply.find({ forumId: reply.forumId });
    await Forum.findOneAndUpdate(
      { _id: reply.forumId },
      {
        numberOfReplies: repliesOfForum.length,
      }
    );
    await Reply.updateMany(
      { "quoted.replyId": reply._id },
      { "quoted.isDeleted": true }
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

controller.deleteAllReplies = async (req, res) => {
  try {
    await Reply.deleteMany();
    res.json("Deleted all replies");
  } catch (error) {
    next(error);
  }
};

module.exports = controller;
