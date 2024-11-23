const router = require('express').Router();
const userRouter = require('./users');
const itemRouter= require('./clothingItems');

router.use('/users', userRouter);
router.use('/items', itemRouter);


router.use((req, res) => {
  res.status(500).send({message: 'Router not found'})
})

module.exports = router;