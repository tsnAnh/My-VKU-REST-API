const multer = require("multer");
const fs = require("fs-extra");
var randomstring = require("randomstring");

module.exports = multer({
  storage: multer.diskStorage({
    destination: async (req, file, callback) => {
      let path = __dirname + "/../public/images/" + req.params.idThread;
      if (!fs.existsSync(path)) {
        await fs.mkdirSync(path);
      }
      callback(null, path);
    },
    filename: function (req, file, cb) {
      cb(null, randomstring.generate() + "-" + file.originalname);
    },
  }),
});
