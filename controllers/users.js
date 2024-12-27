const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");


const NotFoundError = require("../errors/not-found");
const BadRequestError = require("../errors/bad-request");
const ConflictError = require("../errors/duplicate-item");
const ServerError = require("../errors/server_error");

const errorHandler = require('../middlewares/error-handler');

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("The email and password fields are required"));
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError("The user already exists");
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
      errorHandler(err, next)
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("The email and password fields are required"));
  }

  if (!validator.isEmail(email)) {
    return next(new BadRequestError("Invalid email format"));
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

const getCurrentUser = (req, res, next) => {
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
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("The email and password fields are required"));
      }

      return next(new ServerError("Server error"));
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req?.user?._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send({ name: user.name, avatar: user.avatar }))
    .catch((err) => {
      errorHandler(err, next);
    });
};

module.exports = { createUser, getCurrentUser, updateProfile, login };
