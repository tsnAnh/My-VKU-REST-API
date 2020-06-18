const mongoose = require("mongoose");

//MODEL
const Reply = require("../model/Reply");
const Thread = require("../model/Thread");
const Forum = require("../model/Forum");
const User = require("../model/User");

const controller = {};

//MAKE A REPLY
controller.newReply = async (req, res) => {
  const { content, quoted } = req.body;
  const uidGG = req.userGG.sub;
  const threadId = req.params.threadId;
  const images = req.files;
  const createdAt = new Date().getTime();
  try {
    const user = await User.findOne({ uidGG });

    const newReply = new Reply({
      uid: user._id,
      threadId,
      content,
      createdAt,
      images,
    });
    //Check if quoted exsit and is in the thread
    const reply = await Reply.findOne({ _id: quoted, threadId });
    if (reply) {
      newReply.quoted = quoted;
    }
    await newReply.save();

    //Update Thread and Forum
    const thread = await Thread.findOneAndUpdate(
      { _id: threadId },
      {
        lastUpdatedOn: createdAt,
        $inc: {
          numberOfReplies: 1,
        },
      }
    );
    await Forum.findOneAndUpdate(
      { _id: thread.forumId },
      {
        lastUpdatedOn: createdAt,
        $inc: {
          numberOfReplies: 1,
        },
      }
    );

    res.json(newReply);
  } catch (e) {
    throw e;
  }
};

module.exports = controller;
