const express = require("express");
const { MongoClient } = require("mongodb");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const routes = require("./routes");
app.use("/api", routes);

app.get("/ping", (req, res) => {
  res.json({message:"pong"});
});

app.get("/", (req, res) => {
  res.send(`go to /ping`);
});

app
  .listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  })
  .on("error", (err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
