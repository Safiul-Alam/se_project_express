const User = require("../models/user");

// Get /users
const getUsers = (req, res) => {
  // console.log("in controller");
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      // console.log(err.name);
      return res.status(500).send({ message: err.message });
    });
};

// POST /users
const createUsers = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
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
   .then((user) => res.status(200).send(user))
   .catch((err) => {
    console.error(err)
    // console.log(err.name);
    if(err.name === "DocumentNotFoundError") {
      return res.status(404).send({ message: "User Not Found"});
    }
    if (err.name === "CastError") {
      return res.status(400).send({ message: "User Not Found" });
    }
    return res.status(500).send({ message: "Internal Service Error" });
   })
}

module.exports = { getUsers, createUsers, getUser };
