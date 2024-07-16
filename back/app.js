const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const authenticateToken = require("./routes/helpers/authMiddleware");
const jszip = require("jszip");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  console.log(
    "\n----------------------\nNew request received at " + new Date()
  );
  console.log("Method: " + req.method);
  console.log("URL: " + req.originalUrl);
  console.log("Body: " + JSON.stringify(req.body));
  next();
});

// expose the uploads folder to the front
app.use("/uploads", express.static("uploads"));

app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));
app.use("/gallery", require("./routes/gallery"));
app.use("/data", require("./routes/data"));

app.listen(3000, function () {
  console.log("Server is running at http://localhost:3000");
});

module.exports = app;
