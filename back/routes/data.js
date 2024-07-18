// Init router
const router = require("express").Router();
const jszip = require("jszip");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticateToken } = require("./helpers/authMiddleware");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../temp"));
  },
  filename: function (req, file, cb) {
    cb(null, "temp" + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/save", authenticateToken, async (req, res) => {
  // if the user is owner, save all the data in a zip file:
  // the upload/pp and upload/gallery folder in a upload folder
  // all the data in a data.json file
  // send the zip file to the user
  try {
    console.log("SAVING DATA");
    if (req.user.privilege === "owner") {
      dataUsers = await prisma.users.findMany();
      dataPosts = await prisma.posts.findMany();
      dataGallery = await prisma.gallery.findMany();

      const data = {
        users: dataUsers,
        posts: dataPosts,
        gallery: dataGallery,
      };
      console.log("WRITING DATA.JSON");
      fs.writeFileSync("data.json", JSON.stringify(data));

      const zip = new jszip();
      zip.file("data.json", fs.readFileSync("data.json"));
      zip.folder("uploads");
      zip.folder("uploads/pp");
      zip.folder("uploads/gallery");

      console.log("READING FILES");
      const ppFiles = fs.readdirSync("uploads/pp");
      const galleryFiles = fs.readdirSync("uploads/gallery");

      console.log("WRITING PP FILES");
      ppFiles.forEach((file) => {
        zip.file(
          `uploads/pp/${file}`,
          fs.readFileSync(path.join("uploads/pp", file))
        );
      });

      console.log("WRITING GALLERY FILES");
      galleryFiles.forEach((file) => {
        zip.file(
          `uploads/gallery/${file}`,
          fs.readFileSync(path.join("uploads/gallery", file))
        );
      });

      console.log("GENERATING ZIP");
      const zipData = await zip.generateAsync({ type: "nodebuffer" });

      console.log("SENDING ZIP");
      res.set("Content-Type", "application/zip");
      res.set("Content-Disposition", "attachment; filename=data.zip");
      res.set("Content-Length", zipData.length);
      res.send(zipData);

      console.log("DELETING DATA.JSON");
      fs.unlinkSync("data.json");
    } else {
      console.log("You are not allowed to do this");
      res.status(403).json({ message: "You are not allowed to do this" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/restore",
  authenticateToken,
  upload.single("zip"),
  async (req, res) => {
    // if the user is owner, restore the data from the zip file
    // the zip file contains the upload/pp and upload/gallery folder in a upload folder
    // all the data in a data.json file
    // restore the data from the data.json file
    // restore the files from the zip file
    try {
      if (req.user.privilege === "owner") {
        if (!req.file) {
          res.status(400).json({ message: "No file uploaded" });
          return;
        }
        const zipFile = req.file;
        const zipPath = zipFile.path;

        fs.renameSync(zipFile.path, zipPath);

        const data = fs.readFileSync(zipPath);
        const zip = await jszip.loadAsync(data);

        const files = zip.files;

        // the pp files are all the files that has as a key the string "uploads/pp/something" and is not a folder (dir: false)
        const ppFiles = Object.keys(files).reduce((acc, file) => {
          if (file.startsWith("uploads/pp/") && !files[file].dir) {
            acc[file] = files[file];
          }
          return acc;
        }, {});

        // the gallery files are all the files that has as a key the string "uploads/gallery/something" and is not a folder (dir: false)
        const galleryFiles = Object.keys(files).reduce((acc, file) => {
          if (file.startsWith("uploads/gallery/") && !files[file].dir) {
            acc[file] = files[file];
          }
          return acc;
        }, {});

        const dataFile = files["data.json"];

        if (!dataFile) {
          res.status(400).json({ message: "Invalid zip file" });
          return;
        }

        const ppFilesArray = Object.keys(ppFiles);
        const galleryFilesArray = Object.keys(galleryFiles);

        // clear the content of the pp folder (dont delete the folder)
        fs.readdirSync("uploads/pp").forEach((file) => {
          fs.unlinkSync(path.join("uploads/pp", file));
        });

        console.log("WRITING PP FILES");
        ppFilesArray.forEach((file) => {
          const content = ppFiles[file];
          content.nodeStream().pipe(fs.createWriteStream(file));
        });

        // clear the content of the gallery folder
        fs.readdirSync("uploads/gallery").forEach((file) => {
          fs.unlinkSync(path.join("uploads/gallery", file));
        });

        console.log("WRITING GALLERY FILES");
        galleryFilesArray.forEach((file) => {
          const content = galleryFiles[file];
          content.nodeStream().pipe(fs.createWriteStream(file));
        });

        const dataContent = await dataFile.async("nodebuffer");
        const dataJSON = JSON.parse(dataContent.toString());

        // clear the posts
        await prisma.posts.deleteMany();
        // clear the gallery
        await prisma.gallery.deleteMany();
        // clear the users
        await prisma.users.deleteMany();

        console.log("WRITING USERS");
        for (const user of dataJSON.users) {
          try {
            const createdUser = await prisma.users.create({
              data: {
                id: user.id,
                username: user.username,
                name: user.name,
                password: user.password,
                picture: user.picture,
                privilege: user.privilege,
              },
            });
          } catch (error) {
            console.log("ERROR", error);
          }
        }

        console.log("WRITING POSTS");
        for (const post of dataJSON.posts) {
          await prisma.posts.create({
            data: {
              id: post.id,
              title: post.title,
              published: post.published,
              content: post.content,
              date: post.date,
              authorId: post.authorId,
            },
          });
        }

        console.log("WRITING GALLERY");
        for (const media of dataJSON.gallery) {
          await prisma.gallery.create({
            data: {
              id: media.id,
              title: media.title,
              published: media.published,
              media: media.media,
              date: media.date,
              authorId: media.authorId,
            },
          });
        }

        fs.unlinkSync(zipPath);

        res.json({ message: "Data restored successfully" });
      } else {
        console.log("You are not allowed to do this");
        res.status(403).json({ message: "You are not allowed to do this" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
