const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  uidGG: String,
  email: String,
  role: Number,
  photoURL: String,
  displayName: String,
});

module.exports = mongoose.model("User", UserSchema);
