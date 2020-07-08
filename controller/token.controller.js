//MODEL
const Token = require("../model/Token");

const controller = {};

//GET ALL TOKENS
controller.getAllTokens = async (req, res, next) => {
  try {
    const tokens = await Token.find();
    res.json(tokens);
  } catch (error) {
    next(error);
  }
};
module.exports = controller;
