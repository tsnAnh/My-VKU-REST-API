const multer = require("multer");
const fs = require("fs-extra");
var randomstring = require("randomstring");
const { ErrorHandler } = require("../helpers/error");

module.exports = multer({
  storage: multer.diskStorage({
    destination: async (req, file, callback) => {
      let path = __dirname + "\\..\\public\\images\\";
      if (!fs.existsSync(path)) {
        await fs.mkdirSync(path);
      }
      callback(null, path);
    },
    filename: function (req, file, cb) {
      cb(null, randomstring.generate() + "-" + file.originalname);
    },
  }),
  // Max size of file = 10MB
  limits: { fileSize: 10000000 },
  //Only accept image
  fileFilter: (req, file, cb) => {
    const typeFile = file.mimetype.indexOf("image");
    if (typeFile > -1) {
      cb(null, true);
    } else {
      cb(new ErrorHandler(400, "Only upload image"), false);
    }
  },
});
