const mongoose = require("mongoose");

//MODEL
const Reply = require("../model/Reply");
const Thread = require("../model/Thread");
const Forum = require("../model/Forum");
const User = require("../model/User");

const controller = {};
//TODO: TEST
//CREATE A NEW REPLY
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
        $inc: {
          numberOfReplies: 1,
        },
      }
    );

    res.json(newReply);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//DELETE A REPLY
controller.deleteReplyOfThread = async (req, res) => {};

//-----------ADMIN------------
controller.getAllReplies = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

controller.deleteAllReplies = async (req, res) => {};

module.exports = controller;
