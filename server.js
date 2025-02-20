const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnectionStatus = "Not connected";

client.connect((err) => {
  if (err) {
    dbConnectionStatus = "Failed to connect";
    console.error(err);
  } else {
    dbConnectionStatus = "Connected";
    console.log("Connected to MongoDB");
  }
});

app.get("/", (req, res) => {
  res.send(`Database connection status: ${dbConnectionStatus}`);
});

app.get("/ping", (req, res) => {
  res.send("Pong");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
