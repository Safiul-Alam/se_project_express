const express = require("express");

const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  validateItemId,
  validateCardBody,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.post("/", auth, validateCardBody, createItem);

router.get("/", getItems);

router.put("/:itemId/likes", auth, validateItemId, likeItem);

router.delete("/:itemId", auth, validateItemId, deleteItem);

router.delete("/:itemId/likes", auth, validateItemId, unlikeItem);

module.exports = router;
