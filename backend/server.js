require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose');
const cors = require("cors");
const dealersRoutes = require("./routes/dealersRoutes");
const MONGODB_STRING = process.env.MONGODB_STRING;

// express app
const app = express();

app.use(cors());

// connecting to the database

mongoose
  .connect(MONGODB_STRING)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        "Connected to the database and listening on port",
        process.env.PORT
      );
    });
  })
  .catch((err) => console.log(err));

// middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.json({ mssg: "Welcome to the app" });
});

// listen for requests
// workout routes

app.use("/api/dealers", dealersRoutes);
