const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { handleErrors } = require("../utils/errors");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,

  CONFLICT,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "The email and password fields are required" });
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error("The user already exists");
        error.statusCode = CONFLICT;
        throw error;
      }

      return bcrypt.hash(password, 10).then((hash) =>
        User.create({
          name,
          avatar,
          email,
          password: hash,
        })
      );
    })
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).json(userWithoutPassword);
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "The email and password fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid email format" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

const getCurrentUser = (req, res) => {
  // optional chaining is a great way to handle cases where req.user might be undefined.
  const id = req?.user?._id;
  User.findById(id)
    .orFail()
    .then((user) => {
      const { _id, email, avatar, name } = user;
      res.status(200).send({
        _id,
        email,
        avatar,
        name,
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "User ID is not in valid format" });
      }
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal server error" });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    req?.user?._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send({ name: user.name, avatar: user.avatar }))
    .catch((err) => {
      handleErrors(res, err);
    });
};

module.exports = { createUser, getCurrentUser, updateProfile, login };
