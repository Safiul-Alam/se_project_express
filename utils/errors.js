const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const AUTHENTICATION_ERROR = 401;
const FORBIDDEN = 403;
const CONFLICT = 409;

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  AUTHENTICATION_ERROR,
  FORBIDDEN,
  CONFLICT,
};

const handleErrors = (res, err) => {
  console.error(err);
  // eslint-disable-next-line no-console
  console.log("Error Name:", err.name);
  if (err.name === "DocumentNotFoundError") {
    return res.status(NOT_FOUND).send({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(BAD_REQUEST).send({ message: "Invalid data" });
  }
  if (err.message === "Incorrect email or password") {
    return res
      .status(AUTHENTICATION_ERROR)
      .send({ message: "Incorrect email or password" });
  }
  if (err.name === "ValidationError") {
    return res.status(BAD_REQUEST).send({ message: "Invalid user" });
  }
  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "An error has occurred on the server " });
};

module.exports = handleErrors;
