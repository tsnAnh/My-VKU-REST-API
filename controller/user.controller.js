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
    }).lean();
    if (!user) {
      const newUser = new User({
        uidGG: sub,
        email: email,
        displayName: name,
        photoURL: picture,
      });
      console.log(name);
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
  const { name, picture } = req.userGG;
  const user = req.user;
  try {
    //update photo and displayname
    user.displayName = name;
    user.photoURL = picture;
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
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
module.exports = controller;
