

const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { STATUS_NOT_FOUND } = require("../utils/constants");
const { login, createUsers } = require("../controllers/users");
const {auth} = require('../middleware/auth');


router.use("/items", itemRouter);
router.post("/signin", login);
router.post("/signup", auth, createUsers);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
