const router = require("express").Router();
const { updateProfile, getCurrentUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const { validateUpdateUser } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUpdateUser, updateProfile);

module.exports = router;
