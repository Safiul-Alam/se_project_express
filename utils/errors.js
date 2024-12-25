const NotFoundError = require("../errors/not-found");
const BadRequestError = require("../errors/bad-request");
const ConflictError = require("../errors/duplicate-item");
const ServerError = require("../errors/server_error");
const AuthenticationError = require("../errors/authentication-error");

const handleErrors = (res, err) => {
  console.error(err);
  // eslint-disable-next-line no-console
  console.log("Error Name:", err.name);

  if (err.name === "DocumentNotFoundError") {
    throw new NotFoundError("Document not found");
  }
  if (err.name === "CastError") {
    throw new BadRequestError("Invalid data");
  }
  if (err.message === "Incorrect email or password") {
    throw new AuthenticationError("Incorrect email or password");
  }
  if (err.name === "ValidationError") {
    throw new BadRequestError("Invalid user");
  }
  if (err.message === "The user already exists") {
    throw new ConflictError("Email already registered");
  }

  throw new ServerError("An error has occurred on the server ");
};

module.exports = {
  handleErrors,
};
