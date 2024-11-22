const router = require('express').Router;

const { createItem } = require('../controllers/clothingItems')




// Create
router.post('/', createItem);


module.exports = router;