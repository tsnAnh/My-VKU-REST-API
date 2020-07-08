const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  tokenFCM: String,
  uid: {
    type: String,
    ref: "User",
  },
});

module.exports = mongoose.model("Token", TokenSchema);
