const express = require("express");
const router = express.Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");

// Create
router.post("/", createItem);

// READ
router.get("/", getItems);

// UPdate
router.put("/:itemId", updateItem);

// Delete
router.delete("/:itemId", deleteItem);

module.exports = router;
