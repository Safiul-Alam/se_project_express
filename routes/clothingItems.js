const express = require("express");

const router = express.Router();
const { auth } = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.post("/", auth, createItem);

router.get("/", getItems);

router.put("/:itemId/likes", auth, likeItem);

router.delete("/:itemId", auth, deleteItem);

router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
