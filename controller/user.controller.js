const User = require("../model/User");

const controller = {};

//LOAD USER
controller.login = async (req, res) => {
  const userGG = req.userGG;
  try {
    const user = await User.findOne({
      //sub là id user của GG
      uidGG: userGG.sub,
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
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//GET INFOR OF USER
controller.loadUser = async (req, res) => {
  const userGG = req.userGG;
  try {
    let user = await User.findOne({ uidGG: userGG.sub }).lean();
    user.GG = userGG;
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = controller;
