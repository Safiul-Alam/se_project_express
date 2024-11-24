const User = require("../models/user");
const { STATUS_OK, STATUS_DEFAULT, STATUS_CREATED, STATUS_NOT_FOUND } = require('../utils/constants');
const {handleErrors} = require('../utils/errors');

// Get /users
const getUsers = (req, res) => {
  // console.log("in controller");
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      handleErrors(res, err);
    });
};

// POST /users
const createUsers = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(STATUS_CREATED).send(user);
    })
    .catch((err) => {
      console.error(err);
      handleErrors(res, err);
    });
};

const getUser = (req, res) => {
  const {userId} = req.params;

  User.findById(userId)
  .orFail(() => {
    const error = new Error("User ID not found");
    error.name = "DocumentNotFoundError";
    throw error;
  })
   .then((user) => res.status(STATUS_OK).send(user))
   .catch((err) => {
    console.error(err)
    // console.log(err.name);
    handleErrors(res, err);
   })
}

module.exports = { getUsers, createUsers, getUser };
