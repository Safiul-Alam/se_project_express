const BadRequestError = require("../errors/bad-request");
const ConflictError = require("../errors/duplicate-item");
const AuthenticationError = require("../errors/authentication-error");
const ForbiddenError = require("../errors/forbidden");
const {
  castErrorMessage,
  validationErrorMessage,
  documentNotFound,
  duplicateEmailErrorMessage,
  defaultErrorMessage,
  forbiddenErrorMessage,
  badTokenErrorMessage,
} = require("../utils/errors-messages-statuses");
const NotFoundError = require("../errors/not-found");

const errorHandler = (err, next) => {
  console.error(err);

  if (err.code === 11000) {
    return next(new ConflictError(duplicateEmailErrorMessage));
  }

  switch (err.name) {
    case "CastError":
      return next(new BadRequestError(castErrorMessage));
    case "ValidationError":
      return next(new BadRequestError(validationErrorMessage));
    case "AuthenticationError":
      return next(new AuthenticationError(badTokenErrorMessage));
    case "Forbidden":
      return next(new ForbiddenError(forbiddenErrorMessage));
    case "DocumentNotFoundError":
      return next(new NotFoundError(documentNotFound))
    default:
      return next(err);
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
