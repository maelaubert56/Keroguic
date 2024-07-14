var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const authenticateToken = require("./helpers/authMiddleware.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("dotenv").config();
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

router.get("/", authenticateToken, async function (req, res) {
  const posts = await prisma.posts.findMany({
    include: {
      author: true,
    },
  });
  res.json(posts);
});

router.get("/:id", authenticateToken, async function (req, res) {
  try {
    const id = req.params.id;

    const post = await prisma.posts.findUnique({
      where: {
        id: id,
      },
    });
    if (post === null) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // give the article only if the user is admin or owner or editor of the post OR is the author of the post

    if (
      req.user.privilege !== "admin" &&
      req.user.privilege !== "owner" &&
      req.user.privilege !== "editor" &&
      req.user.id !== post.authorId
    ) {
      res
        .status(403)
        .json({ error: "You are not allowed to access this post" });
      return;
    }

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", authenticateToken, async function (req, res) {
  const { title, content, author, date } = req.body;
  // if the user is admin or owner or editor of the post, then he can put any authorId
  if (req.user.privilege === "editor" && req.user.id !== author) {
    res
      .status(403)
      .json({ error: "You are not allowed to put another authorId" });
    return;
  }

  const post = await prisma.posts.create({
    data: {
      title,
      content,
      authorId: author,
      date,
    },
  });
  res.json(post);
});

router.put("/:id", authenticateToken, async function (req, res) {
  try {
    const id = req.params.id;
    const { title, content, author, date } = req.body;

    const post = await prisma.posts.findUnique({
      where: {
        id: id,
      },
    });

    if (post === null) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // if the user is not admin or owner or editor, and is not the author of the post, then he can't edit the post
    if (
      req.user.privilege !== "admin" &&
      req.user.privilege !== "owner" &&
      req.user.privilege !== "editor" &&
      req.user.id !== post.authorId
    ) {
      res.status(403).json({ error: "You are not allowed to edit this post" });
      return;
    }

    // if the user is editor, he can't change the authorId
    if (req.user.privilege === "editor" && post.authorId !== author) {
      res
        .status(403)
        .json({ error: "You are not allowed to put another authorId" });
      return;
    }

    const updatedPost = await prisma.posts.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
        authorId: author,
        date,
      },
    });
    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", authenticateToken, async function (req, res) {
  try {
    const id = req.params.id;

    const post = await prisma.posts.findUnique({
      where: {
        id: id,
      },
    });

    if (post === null) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // if the user is not admin or owner or editor, and is not the author of the post, then he can't delete the post
    if (
      req.user.privilege !== "admin" &&
      req.user.privilege !== "owner" &&
      req.user.privilege !== "editor" &&
      req.user.id !== post.authorId
    ) {
      res
        .status(403)
        .json({ error: "You are not allowed to delete this post" });
      return;
    }

    await prisma.posts.delete({
      where: {
        id: id,
      },
    });
    res.json({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
