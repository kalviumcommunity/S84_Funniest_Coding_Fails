const express = require("express");
const app = express();

app.get("/ping", (req, res) => {
  res.send("Pong");
});

// Set the port
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
