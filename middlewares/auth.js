const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const AuthenticationError = require("../errors/authentication-error");

const auth = (req, res, next) => {
  const token = req.headers?.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.replace("Bearer ", "")
    : null;

  if (!token) {
    return next(new AuthenticationError("Authorization required"));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Attach the user payload to the request object
    return next(); // Proceed to the next middleware or route
  } catch (err) {
    return next(new AuthenticationError("Authorization required"));
  }
};

module.exports = { auth };
