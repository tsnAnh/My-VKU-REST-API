//MODEL
const Forum = require("../model/Forum");
const Thread = require("../model/Thread");

const controller = {};

//GET ALL FORUMS
controller.getForums = async (req, res) => {
  try {
    let forums = await Forum.find();
    res.json(forums);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

// GET A FORUM BY ID
controller.getForumById = async (req, res) => {
  const idForum = req.params.idForum;
  try {
    const forum = await Forum.findById(idForum);

    res.json(forum);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

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

//GET ALL THREADS OF A FORUM
controller.getThreadsByForumId = async (req, res) => {
  try {
    const threads = await Thread.find({
      forum_id: req.params.forum_id,
    }).sort({ created_at: -1 });
    res.json(threads);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = controller;
