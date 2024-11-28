const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const {AUTHENTICATION_ERROR} = require('../utils/errors')

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(AUTHENTICATION_ERROR).send({ message: "Authorization required." });
  }

  const token = authorization.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next(); // Ensure next is called
  } catch (err) {
    return res.status(AUTHENTICATION_ERROR).send({ message: "Invalid or expired token." });
  }
};