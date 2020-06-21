const { OAuth2Client } = require("google-auth-library");
const { ErrorHandler } = require("../../helpers/error");

//CONFIG
const CLIENT_ID = process.env.CLIENT_ID_TEST;
const client = new OAuth2Client(CLIENT_ID);

exports.authGoogle = async (req, res, next) => {
  const token = req.headers["gg-auth-token"];

  try {
    // Check if not token
    if (!token || token === "undefined") {
      throw new ErrorHandler(401, "Token is not valid");
    }

    await client
      .verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      })
      .then((ticket) => {
        req.userGG = ticket.getPayload();
      })
      .catch((err) => {
        throw new ErrorHandler(401, "Token is not valid");
      });
    //CHECK DOMAIN
    if (req.userGG.hd !== "sict.udn.vn") {
      throw new ErrorHandler(403, "Don not have access");
    }
    next();
  } catch (error) {
    next(error);
  }
};
