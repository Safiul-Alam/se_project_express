const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const handleErrors = (res, err) => {
  console.error(err);
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).send({ success: false, message: err.message });
  }
  if (err.name === "DocumentNotFoundError") {
    return res.status(404).send({ success: false, message: err.message });
  }
  return res.status(500).send({ success: false, message: "Internal server error" });
};

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      }
      res.status(500).send({ message: "Error from getItems", err });
    });
};

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log(req.user._id);

  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(200).send({ item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

// Create item with owner
const createClothingItem = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const item = await ClothingItem.create({ ...req.body, owner: ownerId });
    res.status(201).send({ success: true, data: item });
  } catch (err) {
    handleErrors(res, err);
  }
};


const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) =>{
      console.error(err);
      console.log(err.name);
      res.status(500).send({ message: "Error from updateItem", err })
    }


    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then(() => res.status(200).send({ message: "Deletion successful" }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Item not found" });
      }
      return res.status(500).send({ message: "Internal server error" });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Card ID not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Item not found" });
      }
      return res.status(404).send({ message: "Internal server error" });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
  createClothingItem
};
