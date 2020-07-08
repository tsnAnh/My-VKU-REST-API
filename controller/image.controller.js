const fs = require("fs");
const path = require("path");
const { model } = require("../model/User");

let imagePath = __dirname + "/../public/images/";
if (process.env.NODE_ENV === "production") {
  imagePath = process.env.IMAGE_PATH;
}
const controller = {};

//DELETE SOME IMAGES
controller.delete = async (req, res) => {
  const { images = [] } = req.reply;
  try {
    for (const image of images) {
      await fs.unlink(path.join(imagePath, image), (err) => {
        if (err) {
          throw new Error("Delete images fail");
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//DELETE ALL IMAGES
controller.deleteAll = async () => {
  try {
    await fs.readdir(imagePath, {}, async (err, dirs) => {
      dirs.forEach(async (dir) => {
        await fs.rmdir(
          path.join(imagePath, dir),
          { recursive: true },
          (err) => {
            if (err) {
              throw new Error("Delete all images fail");
            }
          }
        );
      });
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = controller;
