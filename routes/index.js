const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const { login, createUser } = require("../controllers/users");

const { NOT_FOUND } = require("../utils/errors");

router.post("/signup", createUser);
router.post("/signin", login);
router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
