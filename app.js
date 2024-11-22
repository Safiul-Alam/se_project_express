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
    console.log("Coonected to DB");
  })
  .catch(console.error);


app.use(express.json());
// routes
app.use('/', mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
