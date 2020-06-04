const User = require("../schema/User.module");

const loadUser = async (req, res) => {
  const userGG = req.locals.userGG;

  try {
    const user = await User.findOne({
      //sub là id user của GG
      uid: userGG["sub"],
    });
    if (!user) {
      const newUser = new User({
        uid: userGG["sub"],
        displayName: userGG["name"],
        photoUrl: userGG["picture"],
        email: userGG["email"],
        // emailVerified: userRecord.emailVerified,
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

const getUser = async (req, res) => {
  const id = req.body;
  try {
    const user = await User.findById(id);
    await res.json(user);
  } catch (e) {
    await res.json({
      msg: "Unexpected error",
      error: e,
    });
    throw e;
  }
};

module.exports = {
  loadUser,
  getUser,
};
