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

  if (err.code === 11000) {
    return next(new ConflictError(duplicateEmailErrorMessage));
  }

  switch (err.name) {
    case "CastError":
      return next(new BadRequestError(castErrorMessage));
    case "ValidationError":
      return next(new BadRequestError(validationErrorMessage));
    case "SignInFail":
      return next(new AuthenticationError(signinFailErrorMessage));
    case "Unauthorized":
      return next(new AuthenticationError(badTokenErrorMessage));
    case "Forbidden":
      return next(new ForbiddenError(forbiddenErrorMessage));
    default:
      return res.status(500).send({ message: 'Server error occurred' });
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
