const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  uidGG: String,
  email: String,
  role: Number,
});

module.exports = mongoose.model("user", UserSchema);
