class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
const handleError = (err, res) => {
  let { statusCode = 500, message = "Server error", kind } = err;
  if (kind === "ObjectId") {
    statusCode = 404;
    message = "Not found";
  }
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};
module.exports = {
  ErrorHandler,
  handleError,
};
