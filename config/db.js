const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

module.exports = connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("DB connected!");
  } catch (e) {
    console.log(e);
  }
};
