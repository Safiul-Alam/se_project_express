const express = require("express");
const { auth } = require("../middleware/auth");

const router = express.Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// Create
router.post("/", auth, createItem);

// READ
router.get("/", getItems);

// UPdate
// router.put("/:itemId", updateItem);

// Delete
router.delete("/:itemId", auth, deleteItem);

// LIKE ITEM
router.put("/:itemId/likes", auth, likeItem);

// UNLIKE
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
