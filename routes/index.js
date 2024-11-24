const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { STATUS_NOT_FOUND } = require("../utils/constants");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
