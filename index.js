const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 9000;

const app = express();

app.get("/", (req, res) => {
  res.send("Working...");
});

app.listen(PORT, () => {
  console.log("Server started");
});
