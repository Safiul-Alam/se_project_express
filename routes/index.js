const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const { login, createUser } = require("../controllers/users");

const NotFoundError = require("../errors/not-found");
const {
  validateUserLogin,
  validateUserInfo,
} = require("../middlewares/validation");

router.post("/signup", validateUserInfo, createUser);
router.post("/signin", validateUserLogin, login);
router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  throw new NotFoundError("Router not found");
});

module.exports = router;
