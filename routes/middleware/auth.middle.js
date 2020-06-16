const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID_TEST;
const client = new OAuth2Client(CLIENT_ID);

exports.authGoogle = async (req, res, next) => {
  const token = req.headers["gg-auth-token"];

  // Check if not token
  if (!token || token === "undefined") {
    return res.status(401).json({ msg: "Token is not valid" });
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    req.userGG = ticket.getPayload();
    if (req.userGG.hd !== "sict.udn.vn") {
      return res.status(404).json({ msg: "Don't have access" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
