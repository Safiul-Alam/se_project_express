// require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require('./routes/index');

const app = express();
const { PORT = 3001 } = process.env;
// mongoose.connect(process.env.DATABASE_URL);
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // console.log("Coonected to DB");
  })
  .catch(console.error);


app.use(express.json());


// Example test user ID
app.use((req, res, next) => {
  req.user = {
    _id: '67414021fe3d6f70759057e4' // Use the _id of a test user
  };
  next();
});

// routes
app.use('/', mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
