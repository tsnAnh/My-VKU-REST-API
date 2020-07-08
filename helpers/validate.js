const { validationResult } = require("express-validator");
const { ErrorHandler } = require("./error");

module.exports = (validations) => {
  return async (req, res, next) => {
    try {
      await Promise.all(validations.map((validation) => validation.run(req)));
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(new ErrorHandler(422, errors.array()));
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
