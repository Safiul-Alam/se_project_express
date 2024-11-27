const express = require("express");
const { auth } = require("../middleware/auth");

const router = express.Router();
const {
  getUsers,
  createUsers,
  getUser,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

router.get("/users", () => console.log("get users"));
router.get("/users/:userID", () => console.log("get users by id"));
router.post("/users", () => console.log("POST users"));

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUsers);

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);

module.exports = router;
