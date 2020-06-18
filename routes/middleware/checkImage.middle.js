var upload = require("./config/multer").array("myImage", 3);

module.exports = async (req, res, next) => {
  try {
    upload(req, res, function (err) {
      if (err) {
        return res.status(401).json("Upload image fail");
      }
      req.files = req.files.map(
        (file) => `public/images/${req.params.threadId}/${file.filename}`
      );
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Server error");
  }
};
