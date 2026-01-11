var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { authenticateToken, getUser } = require("./helpers/authMiddleware.js");
const bcrypt = require("bcryptjs");
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
  const medias = await prisma.gallery.findMany({
    include: {
      author: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  res.json(medias);
});

router.get("/page/:page", getUser, async function (req, res) {
  try {
    var mediaPerPage = 12;
    if (req.query.nb) {
      mediaPerPage = parseInt(req.query.nb);
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
        skip: (page - 1) * mediaPerPage,
        take: mediaPerPage,
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
        skip: (page - 1) * mediaPerPage,
        take: mediaPerPage,
      });
    }

    const totalMedias = await prisma.gallery.count();
    const totalPages = Math.ceil(totalMedias / mediaPerPage);

    res.json({ medias, totalPages, totalMedias });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", authenticateToken, async function (req, res) {
  try {
    const id = req.params.id;

    const media = await prisma.gallery.findUnique({
      where: {
        id: id,
      },
    });
    if (media === null) {
      res.status(404).json({ error: "Media not found" });
      return;
    }

    res.json(media);
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
    const media = req.file.filename;
    console.log(published);

    // Convert published from string to boolean
    if (published === "true") {
      published = true;
    } else {
      published = false;
    }

    // Convert date to ISO string if it's not already
    if (date && typeof date === "string" && !date.includes("T")) {
      date = new Date(date).toISOString();
    }

    const newMedia = await prisma.gallery.create({
      data: {
        title: title,
        media: media,
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
          newMedia.id +
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
        id: newMedia.id,
      },
      data: {
        media: newMedia.id + path.extname(req.file.originalname),
      },
    });

    res.json(newMedia);
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

      // Convert published from string to boolean
      if (published === "true") {
        published = true;
      } else if (published === "false") {
        published = false;
      }

      // Convert date to ISO string if it's not already
      if (date && typeof date === "string" && !date.includes("T")) {
        date = new Date(date).toISOString();
      }

      // If no author is provided, keep the existing one
      if (!author) {
        author = req.user.id;
      }

      const mediaData = await prisma.gallery.findUnique({
        where: {
          id: id,
        },
      });

      if (mediaData === null) {
        res.status(404).json({ error: "Media not found" });
        return;
      }

      // if the user is not admin or owner or editor, and is not the author of the media, then he can't edit the media
      if (
        req.user.privilege !== "admin" &&
        req.user.privilege !== "owner" &&
        req.user.privilege !== "editor" &&
        req.user.id !== mediaData.authorId
      ) {
        res
          .status(403)
          .json({ error: "You are not allowed to edit this media" });
        return;
      }

      // if the user is editor, he can't change the authorId
      if (req.user.privilege === "editor" && mediaData.authorId !== author) {
        res
          .status(403)
          .json({ error: "You are not allowed to put another authorId" });
        return;
      }

      // if there is a file
      if (req.file) {
        // delete the old file
        fs.unlink(
          path.join(__dirname, "../uploads/gallery/" + mediaData.media),
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

        const updatedMedia = await prisma.gallery.update({
          where: {
            id: id,
          },
          data: {
            title,
            media: id + path.extname(req.file.originalname),
            authorId: author,
            published,
            date,
          },
        });

        // modify the key media to media
        updatedMedia.media = updatedMedia.media;
        delete updatedMedia.media;
        res.json(updatedMedia);
      } else {
        const updatedMedia = await prisma.gallery.update({
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
        res.json(updatedMedia);
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
    const media = await prisma.gallery.findUnique({
      where: {
        id: id,
      },
    });

    if (media === null) {
      res.status(404).json({ error: "Media not found" });
      return;
    }

    // if the user is not admin or owner or editor, and is not the author of the media, then he can't delete the media
    if (
      req.user.privilege !== "admin" &&
      req.user.privilege !== "owner" &&
      req.user.privilege !== "editor" &&
      req.user.id !== media.authorId
    ) {
      res
        .status(403)
        .json({ error: "You are not allowed to delete this media" });
      return;
    }

    // delete the file
    fs.unlink(
      path.join(__dirname, "../uploads/gallery/" + media.media),
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
    res.json({ message: "Media deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
