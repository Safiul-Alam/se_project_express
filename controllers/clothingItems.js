const BadRequestError = require("../errors/bad-request");
const ForbiddenError = require("../errors/forbidden");
const { errorHandler } = require("../middlewares/error-handler");

const ClothingItem = require("../models/clothingItem");

const createItem = async (req, res, next) => {
  try {
    const owner = req?.user?._id;
    const { name, weather, imageUrl } = req.body;

    if (!name || !weather || !imageUrl) {
      throw new BadRequestError("Missing required fields");
    }

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).send({ data: item });
  } catch (err) {
    return errorHandler(err, next);
  }
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req?.user?._id) {
        throw new ForbiddenError("Access to the resource is forbidden");
      }
      return item
        .deleteOne()
        .then(() =>
          res.status(200).send({ message: "Item deleted successfully" })
        );
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req?.user?._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      errorHandler(err, next);
    });
};

const unlikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req?.user?._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      errorHandler(err, next);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
