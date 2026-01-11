var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { authenticateToken, getUser } = require("./helpers/authMiddleware.js");
const bcrypt = require("bcryptjs");
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
    orderBy: {
      date: "desc",
    },
  });
  res.json(posts);
});

router.get("/page/:page", getUser, async function (req, res) {
  try {
    var postPerPage = 12;
    if (req.query.nb) {
      postPerPage = parseInt(req.query.nb);
    }
    const page = req.params.page;

    // if page is negative or nan, return an error
    if (page <= 0 || isNaN(page)) {
      res.status(400).json({ error: "Invalid page number" });
      return;
    }

    var posts = [];
    if (req.user && req.query.all === "true") {
      posts = await prisma.posts.findMany({
        include: {
          author: true,
        },
        orderBy: {
          date: "desc",
        },
        skip: (page - 1) * postPerPage,
        take: postPerPage,
      });
    } else {
      posts = await prisma.posts.findMany({
        include: {
          author: true,
        },
        orderBy: {
          date: "desc",
        },
        where: {
          published: true,
        },
        skip: (page - 1) * postPerPage,
        take: postPerPage,
      });
    }

    const totalPosts = await prisma.posts.count();
    const totalPages = Math.ceil(totalPosts / postPerPage);

    res.json({ posts, totalPages, totalPosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const id = req.params.id;

    const post = await prisma.posts.findUnique({
      where: {
        id: id,
        published: true,
      },
      include: {
        author: true,
      },
    });
    if (post === null) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/edit/:id", authenticateToken, async function (req, res) {
  try {
    const id = req.params.id;

    const post = await prisma.posts.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
      },
    });
    if (post === null) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", authenticateToken, async function (req, res) {
  const { title, content, published, author, date } = req.body;
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
      published,
      authorId: author,
      date,
    },
  });
  res.json(post);
});

router.put("/:id", authenticateToken, async function (req, res) {
  try {
    const id = req.params.id;
    const { title, content, published, author, date } = req.body;

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
        published,
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
