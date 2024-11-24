module.exports = {
  castErrorMessage: "Invalid data format",
  validationErrorMessage: "Data failed validation",
  signinFailErrorMessage: "Incorrect email or password",
  badTokenErrorMessage: "Unauthorized or invalid token",
  forbiddenErrorMessage: "Forbidden action",
  userNotFoundMessage: "User not found",
  itemNotFoundMessage: "Item not found",
  pageNotFoundMessage: "Page not found",
  duplicateEmailErrorMessage: "This email address already exists",
  defaultErrorMessage: "An error has occurred on the server",
  rateLimitReachedMessage:
    "Request limit exceeded, please wait before trying again",
};

const {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_DEFAULT,
} = require("./constants");

const handleErrors = (res, err) => {
  console.error(err);
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res
      .status(STATUS_BAD_REQUEST)
      .send({ success: false, message: err.message });
  }
  if (err.name === "DocumentNotFoundError") {
    return res
      .status(STATUS_NOT_FOUND)
      .send({ success: false, message: err.message });
  }
  return res
    .status(STATUS_DEFAULT)
    .send({ success: false, message: "Internal server error" });
};

module.exports = handleErrors;
