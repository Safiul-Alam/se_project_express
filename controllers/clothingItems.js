const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");
const { handleErrors } = require("../utils/errors");

const createItem = async (req, res) => {
  const owner = req?.user?._id;
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    return res.status(BAD_REQUEST).send({ message: "Missing required fields" });
  }

  try {
    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).send({ data: item });
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data" });
    }

    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req?.user?._id) {
        return res
          .status(FORBIDDEN)
          .send({ message: "Access to the resource is forbidden" });
      }
      return item
        .deleteOne()
        .then(() =>
          res.status(200).send({ message: "Item deleted successfully" })
        );
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req?.user?._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      handleErrors(res, err);
    });
};

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req?.user?._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
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
