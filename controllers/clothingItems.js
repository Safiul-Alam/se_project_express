const ClothingItem = require("../models/clothingItem");

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

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.status(200).send({ item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from createItem", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) =>
      res.status(500).send({ message: "Error from updateItem", err })
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
    .then(() => res.status(200).send({ message: "Deletion successful" })).catch((err) => {
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


module.exports = { createItem, getItems, updateItem, deleteItem };
