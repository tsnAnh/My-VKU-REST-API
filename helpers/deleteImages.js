const fs = require("fs");

module.exports = async (images = []) => {
  try {
    for (const image of images) {
      await fs.unlink("./public" + image, (err) => {
        if (err) {
          throw new Error("Delete images fail");
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};
