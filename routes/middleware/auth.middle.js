const { OAuth2Client } = require("google-auth-library");
const { ErrorHandler } = require("../../helpers/error");

//CONFIG
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_ID_DEV = process.env.CLIENT_ID_DEV;
const client = new OAuth2Client(CLIENT_ID);

exports.authGoogle = async (req, res, next) => {
  const token = req.header("gg-auth-token");
  try {
    // Check if not token
    if (!token || token === "undefined") {
      throw new ErrorHandler(401, "Token is not valid");
    }

    await client
      .verifyIdToken({
        idToken: token,
        audience: [CLIENT_ID, CLIENT_ID_DEV],
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
//TODO: thiếu auth và validator cho admin
// unit test
// security
//TODO: Gộp error vào 1 file
//TODO: handle error system log
