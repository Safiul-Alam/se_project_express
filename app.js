require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to DB");
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`App is listening at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });



// routes
app.use("/", mainRouter);


