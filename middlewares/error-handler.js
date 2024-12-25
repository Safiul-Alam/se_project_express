const BadRequestError = require("../errors/bad-request");
const ConflictError = require("../errors/duplicate-item");
const AuthenticationError = require("../errors/authentication-error");
const ForbiddenError = require("../errors/forbidden");
const {
  castErrorMessage,
  validationErrorMessage,
  signinFailErrorMessage,
  duplicateEmailErrorMessage,
  defaultErrorMessage,
  forbiddenErrorMessage,
  badTokenErrorMessage,
} = require("../utils/errors-messages-statuses");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === 11000)
    throw new ConflictError(duplicateEmailErrorMessage);

  switch (err.name) {
    case "CastError":
      throw new BadRequestError(castErrorMessage);
    case "ValidationError":
      throw new BadRequestError(validationErrorMessage);
    case "SignInFail":
      throw new AuthenticationError(signinFailErrorMessage);
    case "Unauthorized":
      throw new AuthenticationError(badTokenErrorMessage);
    case "Forbidden":
      throw new ForbiddenError(forbiddenErrorMessage);
    default:
      next(err);
  }
};

const errorSender = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? defaultErrorMessage : message,
  });
};

module.exports = {
  errorHandler,
  errorSender,
};
