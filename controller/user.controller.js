//MODEL
const User = require("../model/User");
const Token = require("../model/Token");

const controller = {};

//LOAD USER
controller.login = async (req, res) => {
  const { sub, name, picture, email } = req.userGG;
  const { tokenFCM } = req.body;
  try {
    const user = await User.findOne({
      //sub là id user của GG
      uidGG: sub,
    });

    //CREATE NEW USER
    if (!user) {
      const newUser = new User({
        uidGG: sub,
        email: email,
        displayName: name,
        photoURL: picture,
      });
      await newUser.save();
      await Token.create({
        uid: newUser._id,
        tokenFCM,
      });
      res.json({
        user: newUser,
        isNew: true,
      });
      //LOGIN
    } else {
      user.displayName = name;
      user.photoURL = picture;
      await user.save();

      const token = await Token.findOneAndUpdate(
        {
          uid: user._id,
        },
        { tokenFCM }
      );
      if (!token) {
        await Token.create({
          uid: user._id,
          tokenFCM,
        });
      }
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
  const { name, picture } = req.userGG;
  const { user } = req;
  try {
    //update photo and displayname
    user.displayName = name;
    user.photoURL = picture;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
};

//-----------ADMIN-------
controller.deleteAllUsers = async (req, res) => {
  await User.deleteMany({});
  res.json("Deleted all users");
};
controller.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
controller.getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    res.json(user);
  } catch (error) {
    next(error);
  }
};
module.exports = controller;
