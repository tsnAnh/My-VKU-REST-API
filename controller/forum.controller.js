const { ErrorHandler } = require("../helpers/error");

//MODEL
const Forum = require("../model/Forum");
const Thread = require("../model/Thread");
const Reply = require("../model/Thread");

const controller = {};

//GET ALL FORUMS
controller.getAllForums = async (req, res, next) => {
  try {
    let forums = await Forum.find({}).populate("lastestThread");
    res.json(forums);
  } catch (error) {
    next(error);
  }
};

//GET ALL THREADS OF A FORUM
controller.getAllThreadsOfForum = async (req, res, next) => {
  const forum = req.forum;
  try {
    const threads = await Thread.find({
      forumId: forum._id,
    }).populate("uid");

    res.json(threads);
  } catch (error) {
    next(error);
  }
};

//--------------------
//-----------------ÍT DÙNG-------------------------------------------
//-----------------------

// GET A FORUM BY ID
controller.getForumById = async (req, res, next) => {
  try {
    const forum = req.forum;
    res.json(forum);
  } catch (error) {
    next(error);
  }
};

//--------------------
//-----------------ADMIN---------------------------------------------
//-----------------------

// CREATE A NEW FORUM
controller.createForum = async (req, res, next) => {
  try {
    const { title, tag } = req.body;
    const forum = new Forum({
      title,
      tag,
    });
    await forum.save();

    res.json(forum);
  } catch (error) {
    next(error);
  }
};

//UPDATE  FORUM
controller.updateForum = async (req, res, next) => {
  const { forum } = req;
  const { title, tag } = req.body;
  try {
    const forumUpdated = await Forum.findOneAndUpdate(
      { _id: forum._id },
      {
        title,
        tag,
      },
      {
        new: true,
      }
    );

    res.json(forumUpdated);
  } catch (error) {
    next(error);
  }
};

//DELETE A FORUM
controller.deleteForum = async (req, res, next) => {
  const { forum } = req;
  try {
    await Forum.deleteOne({ _id: forum._id });
    res.json("deleted the forum");
  } catch (error) {
    next(error);
  }
};

//DELETE ALL FORUMS
controller.deleteAllForums = async (req, res, next) => {
  try {
    await Forum.deleteMany({});
    await Thread.deleteMany({});
    await Reply.deleteMany({});
    res.json("Deleted all forums");
  } catch (error) {
    next(error);
  }
};
module.exports = controller;
