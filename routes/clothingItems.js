const express = require('express');
const router = express.Router();

const { createItem, getItems, updateItem } = require('../controllers/clothingItems');

// Create
router.post('/', createItem);

// READ
router.get('/', getItems);

// UPdate
router.put('/:itemId', updateItem);

module.exports = router;