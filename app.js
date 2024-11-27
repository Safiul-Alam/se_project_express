require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;
// mongoose.connect(process.env.DATABASE_URL);
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Coonected to DB");
  })
  .catch(console.error);

app.use(cors());
app.use(express.json());

// Example test user ID
// app.use((req, res, next) => {
//   req.user = {
//     _id: '67414021fe3d6f70759057e4' // Use the _id of a test user
//   };
//   next();
// });

// routes
app.use("/", mainRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
