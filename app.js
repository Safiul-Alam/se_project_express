require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const mainRouter = require("./routes/index");
const { errorHandler } = require("./middlewares/error-handler");

const app = express();
const { PORT = 3001 } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(requestLogger); // Request Logger goes here
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`App is listening at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

// Routes
app.use("/", mainRouter);

// Error Logging and Handling
app.use(errorLogger); // Error Logger here
app.use(errors()); // Celebrate error handler
app.use(errorHandler); // Main error handler

// Crash-test route (temporary)
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

module.exports = app;