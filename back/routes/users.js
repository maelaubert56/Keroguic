var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./helpers/authMiddleware.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/pp/"));
  },
  filename: function (req, file, cb) {
    cb(null, "temp" + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // get the user from the database
    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ message: "Cet utilisateur n'existe pas" });
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // generate access token for the user
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    // send the access token to the client
    res.status(200).json({ token, message: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/all", authenticateToken, async (req, res) => {
  try {
    // check if the user is admin
    if (
      req.user.privilege !== "admin" &&
      req.user.privilege !== "owner" &&
      req.user.privilege !== "editor"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // get all users from the database
    const users = await prisma.users.findMany();

    // send the users to the client
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/single/:id", authenticateToken, async (req, res) => {
  try {
    // return only if ther user is the same as asked or is admin
    if (
      req.user.privilege !== "admin" &&
      req.user.privilege !== "owner" &&
      req.user.id !== req.params.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
    // get the user id from the URL
    const { id } = req.params;
    // get the user from the database
    const user = await prisma.users.findUnique({
      where: { id: id },
    });

    // send the user to the client
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    // get the user information from the database
    const userId = req.user.id;

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    // send the user information to the client
    res.status(200).json({
      id: user.id,
      username: user.username,
      name: user.name,
      picture: user.picture,
      privilege: user.privilege,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/add",
  authenticateToken,
  upload.single("picture"),
  async (req, res) => {
    const { username, name, password, privilege } = req.body;
    const { filename } = req.file;
    try {
      // get the user information from the database
      const askingUser = await prisma.users.findUnique({
        where: { id: req.user.id },
      });

      // get the user from the database to check if the username is already taken
      const user = await prisma.users.findUnique({
        where: { username },
      });

      // if the username is already taken, return an error
      if (user) {
        // remove the media
        fs.unlinkSync(
          path.join(__dirname, "../uploads/pp/temp" + path.extname(filename))
        );
        return res.status(409).json({ message: "Username already taken" });
      }

      // if the user is not admin or owner, he can't add a user
      if (
        askingUser.privilege !== "admin" &&
        askingUser.privilege !== "owner"
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // if the user is admin and try to add an admin or an owner, he can't
      if (
        (privilege === "admin" || privilege === "owner") &&
        askingUser.privilege === "admin"
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // edit the filename to the correct one
      fs.renameSync(
        path.join(__dirname, "../uploads/pp/temp" + path.extname(filename)),
        path.join(__dirname, "../uploads/pp", username + path.extname(filename))
      );

      // create the user in the database
      const newUser = await prisma.users.create({
        data: {
          username,
          name,
          password: await bcrypt.hash(password, saltRounds),
          privilege,
          picture: username + path.extname(filename),
        },
      });

      // send the user information to the client
      res.status(201).json({ message: "User added" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/edit/:id",
  authenticateToken,
  upload.single("picture"),
  async (req, res) => {
    var { name, password, privilege } = req.body;
    const { id } = req.params;

    try {
      // get the user information from the database
      const askingUser = await prisma.users.findUnique({
        where: { id: req.user.id },
      });

      const user = await prisma.users.findUnique({
        where: { id: id },
      });

      // if the user is not admin or if the user is not the same as the one asked
      if (
        askingUser.privilege !== "admin" &&
        askingUser.privilege !== "owner" &&
        askingUser.id !== user.id
      ) {
        return res.status(403).json({ message: "Forbidden, not admin" });
      }

      //if the asked user is not the asking user and the asked user is admin and the asking user is not owner
      if (
        user.privilege === "admin" &&
        askingUser.id !== user.id &&
        askingUser.privilege !== "owner"
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // if the user is not admin, or is himself, he can't change his privilege so keep the old one
      if (
        (askingUser.privilege !== "admin" &&
          askingUser.privilege !== "owner") ||
        askingUser.id === user.id
      ) {
        privilege = user.privilege;
      }

      // if an admin try to put a user as admin or owner, he can't so we keep the old privilege
      if (
        (privilege === "admin" || privilege === "owner") &&
        askingUser.privilege === "admin"
      ) {
        privilege = user.privilege;
      }

      // if there is a new picture, delete the old one and save the new one
      if (req.file) {
        // delete the old picture
        if (user.picture) {
          try {
            fs.unlinkSync(path.join(__dirname, "../uploads/pp", user.picture));
          } catch (err) {
            console.log(err);
          }
        }
        // save the new picture
        fs.renameSync(
          path.join(
            __dirname,
            "../uploads/pp/temp" + path.extname(req.file.filename)
          ),
          path.join(
            __dirname,
            "../uploads/pp",
            user.username + path.extname(req.file.filename)
          )
        );
      }

      var media = req.file
        ? user.username + path.extname(req.file.filename)
        : user.picture;
      // update the user information in the database
      if (password && password !== "") {
        encryptedPassword = await bcrypt.hash(password, saltRounds);
        await prisma.users.update({
          where: { id: user.id },
          data: {
            name,
            password: encryptedPassword,
            privilege,
            picture: media,
          },
        });
      } else {
        await prisma.users.update({
          where: { id: user.id },
          data: {
            name,
            privilege,
            picture: media,
          },
        });
      }
      // send the user information to the client
      res.status(200).json({ message: "Account updated" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.delete("/delete/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // get the user information from the database
    const askingUser = await prisma.users.findUnique({
      where: { id: req.user.id },
    });

    const user = await prisma.users.findUnique({
      where: { id: id },
    });

    // if the user is not admin or owner, he can't delete the user
    if (askingUser.privilege !== "admin" && askingUser.privilege !== "owner") {
      console.log("Forbidden, not admin or owner : ", askingUser.privilege);
      return res.status(403).json({ message: "Forbidden, not admin or owner" });
    }

    // if the user is admin and try to delete the owner or an admin, he can't
    if (
      (user.privilege === "admin" || user.privilege === "owner") &&
      askingUser.privilege === "admin"
    ) {
      console.log("Forbidden, can't delete admin or owner");
      return res
        .status(403)
        .json({ message: "Forbidden, can't delete admin or owner" });
    }

    // if the user try to delete himself, he can't
    if (askingUser.id === user.id) {
      console.log("Forbidden, can't delete yourself");
      return res
        .status(403)
        .json({ message: "Forbidden, can't delete yourself" });
    }

    // delete the user from the database
    await prisma.users.delete({
      where: { id: user.id },
    });

    // delete the user's media
    if (user.picture) {
      try {
        fs.unlinkSync(path.join(__dirname, "../uploads/pp", user.picture));
      } catch (err) {
        console.log(err);
      }
    }

    // send the user information to the client
    res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
