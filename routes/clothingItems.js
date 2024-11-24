const express = require("express");

const router = express.Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// Create
router.post("/", createItem);

// READ
router.get("/", getItems);

// UPdate
// router.put("/:itemId", updateItem);

// Delete
router.delete("/:itemId", deleteItem);

// LIKE ITEM
router.put("/:itemId/likes", likeItem);

// UNLIKE
router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
