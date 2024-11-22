const mongoose = require('mongoose');
const validator = require('validator');

const clothingItem = new mongoose.Schema ({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String ,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Link is not valid',
    },
  },
});

module.exports = mongoose.model('clothingItems', clothingItem);