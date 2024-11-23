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

module.exports = { createItem, getItems, updateItem };
