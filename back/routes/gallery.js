var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { authenticateToken, getUser } = require("./helpers/authMiddleware.js");
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
    cb(null, path.join(__dirname, "../uploads/gallery/"));
  },
  filename: function (req, file, cb) {
    cb(null, "temp" + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

router.get("/", authenticateToken, async function (req, res) {
  const images = await prisma.gallery.findMany({
    include: {
      author: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  // modify the key image to media
  images.forEach((image) => {
    image.media = image.image;
    delete image.image;
  });

  res.json(images);
});

router.get("/page/:page", getUser, async function (req, res) {
  try {
    var imagePerPage = 12;
    if (req.query.nb) {
      imagePerPage = parseInt(req.query.nb);
    }
    const page = req.params.page;

    // if page is negative or nan, return an error
    if (page <= 0 || isNaN(page)) {
      res.status(400).json({ error: "Invalid page number" });
      return;
    }

    var medias = [];
    if (req.user && req.query.all === "true") {
      medias = await prisma.gallery.findMany({
        include: {
          author: true,
        },
        orderBy: {
          date: "desc",
        },
        skip: (page - 1) * imagePerPage,
        take: imagePerPage,
      });
    } else {
      medias = await prisma.gallery.findMany({
        include: {
          author: true,
        },
        orderBy: {
          date: "desc",
        },
        where: {
          published: true,
        },
        skip: (page - 1) * imagePerPage,
        take: imagePerPage,
      });
    }

    const totalMedias = await prisma.gallery.count();
    const totalPages = Math.ceil(totalMedias / imagePerPage);

    // modify the key image to media
    medias.forEach((media) => {
      media.media = media.image;
      delete media.image;
    });

    res.json({ medias, totalPages, totalMedias });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", authenticateToken, async function (req, res) {
  try {
    const id = req.params.id;

    const image = await prisma.gallery.findUnique({
      where: {
        id: id,
      },
    });
    if (image === null) {
      res.status(404).json({ error: "Image not found" });
      return;
    }

    // modify the key image to media
    image.media = image.image;
    delete image.image;

    res.json(image);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/",
  authenticateToken,
  upload.single("media"),
  async function (req, res) {
    var { title, date, author, published } = req.body;
    const image = req.file.filename;
    console.log(published);
    if (published === "true") {
      published = true;
    } else {
      published = false;
    }

    const newImage = await prisma.gallery.create({
      data: {
        title: title,
        image: image,
        published: published,
        date: date,
        authorId: author,
      },
    });

    // rename the file
    fs.rename(
      path.join(
        __dirname,
        "../uploads/gallery/temp" + path.extname(req.file.originalname)
      ),
      path.join(
        __dirname,
        "../uploads/gallery/" +
          newImage.id +
          path.extname(req.file.originalname)
      ),
      function (err) {
        if (err) {
          console.log("ERROR: " + err);
        }
      }
    );

    // change the filename in the database
    await prisma.gallery.update({
      where: {
        id: newImage.id,
      },
      data: {
        image: newImage.id + path.extname(req.file.originalname),
      },
    });

    res.json(newImage);
  }
);

router.put(
  "/:id",
  authenticateToken,
  upload.single("media"),
  async function (req, res) {
    try {
      const id = req.params.id;
      var { title, author, date, published } = req.body;

      const imageData = await prisma.gallery.findUnique({
        where: {
          id: id,
        },
      });

      if (imageData === null) {
        res.status(404).json({ error: "Image not found" });
        return;
      }

      // if the user is not admin or owner or editor, and is not the author of the image, then he can't edit the image
      if (
        req.user.privilege !== "admin" &&
        req.user.privilege !== "owner" &&
        req.user.privilege !== "editor" &&
        req.user.id !== imageData.authorId
      ) {
        res
          .status(403)
          .json({ error: "You are not allowed to edit this image" });
        return;
      }

      // if the user is editor, he can't change the authorId
      if (req.user.privilege === "editor" && imageData.authorId !== author) {
        res
          .status(403)
          .json({ error: "You are not allowed to put another authorId" });
        return;
      }

      // if there is a file
      if (req.file) {
        // delete the old file
        fs.unlink(
          path.join(__dirname, "../uploads/gallery/" + imageData.image),
          function (err) {
            if (err) {
              console.log("ERROR: " + err);
            }
          }
        );

        // rename the file
        fs.rename(
          path.join(
            __dirname,
            "../uploads/gallery/temp" + path.extname(req.file.originalname)
          ),
          path.join(
            __dirname,
            "../uploads/gallery/" + id + path.extname(req.file.originalname)
          ),
          function (err) {
            if (err) {
              console.log("ERROR: " + err);
            }
          }
        );

        const updatedImage = await prisma.gallery.update({
          where: {
            id: id,
          },
          data: {
            title,
            image: id + path.extname(req.file.originalname),
            authorId: author,
            published,
            date,
          },
        });

        // modify the key image to media
        updatedImage.media = updatedImage.image;
        delete updatedImage.image;
        res.json(updatedImage);
      } else {
        const updatedImage = await prisma.gallery.update({
          where: {
            id: id,
          },
          data: {
            title,
            authorId: author,
            published,
            date,
          },
        });
        // modify the key image to media
        updatedImage.media = updatedImage.image;
        delete updatedImage.image;
        res.json(updatedImage);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/:id", authenticateToken, async function (req, res) {
  try {
    const id = req.params.id;
    const image = await prisma.gallery.findUnique({
      where: {
        id: id,
      },
    });

    if (image === null) {
      res.status(404).json({ error: "Image not found" });
      return;
    }

    // if the user is not admin or owner or editor, and is not the author of the image, then he can't delete the image
    if (
      req.user.privilege !== "admin" &&
      req.user.privilege !== "owner" &&
      req.user.privilege !== "editor" &&
      req.user.id !== image.authorId
    ) {
      res
        .status(403)
        .json({ error: "You are not allowed to delete this image" });
      return;
    }

    // delete the file
    fs.unlink(
      path.join(__dirname, "../uploads/gallery/" + image.image),
      function (err) {
        if (err) {
          console.log("ERROR: " + err);
        }
      }
    );

    await prisma.gallery.delete({
      where: {
        id: id,
      },
    });
    res.json({ message: "Image deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
