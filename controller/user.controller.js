//MODEL
const User = require("../model/User");

const controller = {};

//LOAD USER
controller.login = async (req, res) => {
  const { sub, name, picture, email } = req.userGG;
  try {
    const user = await User.findOne({
      //sub là id user của GG
      uidGG: sub,
    });
    if (!user) {
      const newUser = new User({
        uidGG: sub,
        displayName: name,
        photoUrl: picture,
        email: email,
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
  const { sub, name, picture } = req.userGG;
  try {
    let user = await User.findOne({ uidGG: sub }).lean();
    if (!user) {
      return res.status(401).json("User not found");
    }
    user = {
      ...user,
      name,
      picture,
    };
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//-----------ADMIN-------
controller.deleteAllUsers = async (req, res) => {
  const users = await User.remove({});
  res.json("Deleted all users");
};
controller.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
module.exports = controller;
