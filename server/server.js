const express = require("express");
const path = require('path');

const app = new express();
const publicPath = path.join(__dirname,"../public");

app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.send("welcome");
});

app.listen(process.env.PORT, () => {
  console.log("listening on port 3000");
});
