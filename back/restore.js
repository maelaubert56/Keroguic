const fs = require("fs");
const path = require("path");
const jszip = require("jszip");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const restore = async ({ filepath }) => {
  try {
    console.log("RESTORING DATA FROM ", filepath);
    const data = fs.readFileSync(filepath);
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
      console.log("Invalid zip file");
      return;
    }

    const ppFilesArray = Object.keys(ppFiles);
    const galleryFilesArray = Object.keys(galleryFiles);

    // clear the content of the pp folder (dont delete the folder)
    fs.readdirSync("uploads/pp").forEach((file) => {
      fs.unlinkSync(path.join("uploads/pp", file));
    });

    console.log("WRITING PP FILES");
    for (const file of ppFilesArray) {
      const content = ppFiles[file];
      const writeStream = fs.createWriteStream(file);
      content.nodeStream().pipe(writeStream);
      await new Promise((resolve) => writeStream.on("finish", resolve));
    }

    // clear the content of the gallery folder
    fs.readdirSync("uploads/gallery").forEach((file) => {
      fs.unlinkSync(path.join("uploads/gallery", file));
    });

    console.log("WRITING GALLERY FILES");
    for (const file of galleryFilesArray) {
      const content = galleryFiles[file];
      const writeStream = fs.createWriteStream(file);
      content.nodeStream().pipe(writeStream);
      await new Promise((resolve) => writeStream.on("finish", resolve));
    }

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

    console.log("Restore completed");
  } catch (error) {
    console.log(error);
  }
};

var filepath = process.argv[2]; // so the command is : node restore.js path/to/backup.zip

if (!filepath) {
  // go to saves folder and get the latest backup
  const files = fs.readdirSync("./saves");
  const backups = files.filter((file) => file.startsWith("backup_"));
  // files are in the format backup_YYYY-MM-DD-HH-mm-ss.zip
  backups.sort((a, b) => {
    const dateA = new Date(a.slice(7, 26));
    const dateB = new Date(b.slice(7, 26));
    return dateA - dateB;
  });
  filepath = path.join("saves", backups[backups.length - 1]);

  if (!filepath) {
    console.log("No backup found");
    process.exit(1);
  }
}
restore({ filepath: filepath });
