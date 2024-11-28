const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const AUTHENTICATIONERROR = 401;
const FORBIDDEN = 403;
const CONFLICT = 409;

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  AUTHENTICATIONERROR,
  FORBIDDEN,
  CONFLICT,
};

const handleErrors = (res, err) => {
  console.error(err);
  if (err.name === "DocumentNotFoundError") {
    return res.status(NOT_FOUND).send({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(BAD_REQUEST).send({ message: "Invalid data" });
  }
  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "An error has occurred on the server " });
};

module.exports = handleErrors;
