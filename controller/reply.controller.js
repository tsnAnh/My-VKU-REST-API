const mongoose = require("mongoose");

//MODEL
const Reply = require("../model/Reply");
const Thread = require("../model/Thread");
const Forum = require("../model/Forum");

const controller = {};

//GET A REPLY
controller.getReplyById = async (req, res, next) => {
  const reply = req.reply;
  try {
    const aReply = await Reply.findOne({ _id: reply._id }).populate("uid");

    res.json(aReply);
  } catch (error) {
    next(error);
  }
};
//CREATE A NEW REPLY
controller.newReply = async (req, res, next) => {
  let { content, quoted, images } = req.body;
  const { user, thread } = req;
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

    // Create new reply
    const newReply = await Reply.create({
      uid: user._id,
      threadId: thread._id,
      forumId: thread.forumId,
      content,
      quoted,
      images,
    });
    //Add user - expect owner -to subcribers of thread
    if (thread.uid != user._id.toString()) {
      //check if subcriber exist
      const hasExist = thread.subcribers.findIndex(
        (subcriber) => subcriber.uid == user._id
      );
      if (hasExist < 0) {
        thread.subcribers.push({ uid: user._id });
        await thread.save();
      }
    }
    //Update Thread and Forum
    const repliesOfThread = await Reply.find({ threadId: thread._id }).sort({
      _id: -1,
    });
    await Thread.findOneAndUpdate(
      { _id: thread._id },
      {
        latestReply: repliesOfThread.length > 0 ? repliesOfThread[0]._id : null,
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
    req.newReply = newReply;
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//UPDATE A REPLY
controller.updateReply = async (req, res, next) => {
  const { reply } = req;
  const { content, images, deletedImages } = req.body;

  try {
    //Update latestreply và numberOfreply of Forum
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
    await image.delete(deletedImages);

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
        latestReply: repliesOfThread.length > 0 ? repliesOfThread[0]._id : null,
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
    next();
  } catch (error) {
    next(error);
  }
};

//LIKE OR UNLIKE REPLY
controller.interactReply = async (req, res, next) => {
  const { user, reply } = req;
  try {
    //check if the reply has already been liked
    const removeIndex = reply.likes.findIndex((like) => like.uid == user._id);
    if (removeIndex > -1) {
      //Unlike
      reply.likes.splice(removeIndex, 1);
    } else {
      // Like a reply
      reply.likes.unshift({ uid: user._id });
    }

    await reply.save();
    res.json(reply.likes);
    reply.beLiked = removeIndex;
    next();
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

controller.deleteAllReplies = async (req, res, next) => {
  try {
    await Reply.deleteMany();
    await Forum.updateMany(
      {},
      {
        numberOfReplies: 0,
      }
    );
    await Thread.updateMany(
      {},
      {
        numberOfReplies: 0,
        latestReply: null,
      }
    );
    res.json("Deleted all replies");
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = controller;
