//MODEL
const Forum = require("../model/Forum");
const Thread = require("../model/Thread");
const Reply = require("../model/Thread");

const controller = {};

//GET ALL FORUMS
controller.getAllForums = async (req, res) => {
  try {
    let forums = await Forum.find().populate("lastestThread");
    res.json(forums);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//GET ALL THREADS OF A FORUM
controller.getAllThreadsOfForum = async (req, res) => {
  const forumId = req.params.forumId;
  try {
    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(401).json(null);
    }
    const threads = await Thread.find({
      forumId: forumId,
    }).populate("uid");
    res.json(threads);
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(401).json(null);
    }
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//--------------------
//-----------------ÍT DÙNG-------------------------------------------
//-----------------------

// GET A FORUM BY ID
controller.getForumById = async (req, res) => {
  const forumId = req.params.forumId;
  try {
    const forum = await Forum.findById(forumId);

    res.json(forum);
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(401).json(null);
    }
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//--------------------
//-----------------ADMIN---------------------------------------------
//-----------------------

// CREATE A NEW FORUM
controller.createForum = async (req, res) => {
  try {
    const { title, subtitle, description, image } = req.body;
    const forum = new Forum({
      title,
      subtitle,
      description,
      image,
    });
    await forum.save();

    res.json(forum);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//DELETE A FORUM
controller.deleteForum = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//DELETE ALL FORUMS
controller.deleteAllForums = async (req, res) => {
  try {
    await Forum.deleteMany({});
    await Thread.deleteMany({});
    await Reply.deleteMany({});
    res.json("Deleted all forums");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};
module.exports = controller;
