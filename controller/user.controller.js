const User = require("../model/User");

const controller = {};

//LOAD USER
controller.login = async (req, res) => {
  const userGG = req.locals.userGG;
  try {
    const user = await User.findOne({
      //sub là id user của GG
      uidGG: userGG["sub"],
    });
    if (!user) {
      const newUser = new User({
        uidGG: userGG["sub"],
        displayName: userGG["name"],
        photoUrl: userGG["picture"],
        email: userGG["email"],
      });
      await newUser.save();

      res.json({
        user: newUser,
        isNew: true,
      });
    } else {
      res.json({
        user: user,
        isNew: false,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

//GET INFOR OF USER
controller.loadUser = async (req, res) => {
  const uid = req.params.userId;
  try {
    const user = await User.findById(uid);
    res.json(user);
  } catch (e) {
    await res.json({
      msg: "Unexpected error",
      error: e,
    });
    throw e;
  }
};

module.exports = controller;
