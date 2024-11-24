const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const handleErrors = require("../utils/errors");
const {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
} = require("../utils/constants");

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => res.status(STATUS_OK).send(items))
    .catch((err) => {
      // console.log(err);
      handleErrors(res, err);
    });
};

const createItem = (req, res) => {
  // console.log(req);
  // console.log(req.body);
  // console.log(req.user._id);

  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(STATUS_OK).send({ item });
    })
    .catch((err) => {
      console.error(err);
      handleErrors(res, err);
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageUrl } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } }, { new: true })
//     .orFail()
//     .then((item) => res.status(STATUS_OK).send({ data: item }))
//     .catch((err) => {
//       handleErrors(res, err);
//     });
// };

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  // console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then(() => res.status(STATUS_OK).send({ message: "Deletion successful" }))
    .catch((err) => {
      console.error(err);
      handleErrors(res, err);
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(STATUS_BAD_REQUEST)
      .send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(STATUS_NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(STATUS_OK).send({ data: item });
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(STATUS_BAD_REQUEST)
      .send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(STATUS_NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(STATUS_OK).send({ data: item });
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
