const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const User = require("../models/user");
const {
  STATUS_OK,
  STATUS_UNAUTHORIZE,
  STATUS_BAD_REQUEST,
  STATUS_DEFAULT,
  STATUS_NOT_FOUND,
  STATUS_CREATED
} = require("../utils/constants");
const handleErrors = require("../utils/errors");
const { JWT_SECRET } = require("../utils/constants");
const { get } = require("../routes");

// Get /users
const getUsers = (req, res) => {
  // console.log("in controller");
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      handleErrors(res, err);
    });
};

// get single user by id
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      console.error(err);
      // console.log(err.name);
      handleErrors(res, err);
    });
};

// POST /users
// const createUsers = (req, res, next) => {
//   const { name, avatar, email, password } = req.body;

//   User.create({ name, avatar, email: email.toLowerCase(), password: hash })
//     .then((user) => {
//       res.status(STATUS_CREATED).send(user);
//     })
//     .catch((err) => {
//       console.error(err);
//       handleErrors(res, err);
//     });
// };

const createUsers = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res
      .status(STATUS_BAD_REQUEST)
      .send({ message: "The email and password fields are required." });
  }

  // Check if the user already exists
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
      // Remove the password from the returned object
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      // Respond with the created user
      res.status(STATUS_CREATED).json(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);

      // Handle validation errors
      if (err.name === "ValidationError") {
        return res.status(STATUS_BAD_REQUEST).send({ message: "Invalid data provided." });
      }

      // Handle duplicate user error
      if (err.statusCode === STATUS_UNAUTHORIZE) {
        return res
          .status(STATUS_UNAUTHORIZE)
          .send({ message: "The user already exists." });
      }

      // Handle unexpected errors
      res
        .status(STATUS_DEFAULT)
        .send({ message: "Internal server error." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    return res
      .status(STATUS_BAD_REQUEST)
      .send({ message: "The email and password fields are required." });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res
      .status(STATUS_BAD_REQUEST)
      .send({ message: "Invalid email format." });
  }

  // Authenticate user
  User.findUserByCredentials(email, password)
    .then((user) => {
      // Generate JWT if authentication is successful
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res
          .status(STATUS_UNAUTHORIZE)
          .send({ message: "Incorrect email or password." });
      }

      // Handle unexpected errors
      console.error("Login error:", err); // Log the error for debugging
      return res
        .status(STATUS_DEFAULT)
        .send({ message: "Internal server error." });
    });
};

const getCurrentUser = (req, res) => {
  const id = req.user._id;
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
        return res.status(STATUS_NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "User ID is not in valid format" });
      }
      console.error(err);
      return res
        .status(STATUS_DEFAULT)
        .send({ message: "Internal server error" });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send({ name: user.name, avatar: user.avatar }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(STATUS_BAD_REQUEST).send({ message: "Invalid user" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(STATUS_NOT_FOUND).send({ message: "User not found" });
      }
      return res
        .status(STATUS_DEFAULT)
        .send({ message: "Internal server error" });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUsers,
  login,
  getCurrentUser,
  updateProfile,
};
