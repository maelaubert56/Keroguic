const fs = require("fs");
const path = require("path");
const jszip = require("jszip");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const backup = async () => {
  try {
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

    const currentDate = new Date();
    currentDate.setUTCHours(currentDate.getUTCHours() + 2);
    const formattedDate = currentDate
      .toISOString()
      .replace(/[T]/g, "-")
      .replace(/:/g, "-")
      .slice(0, 19);
    fs.writeFileSync(`./saves/backup_${formattedDate}.zip`, zipData);
    console.log("DELETING DATA.JSON");
    fs.unlinkSync("data.json");
    console.log("BACKUP DONE");
  } catch (e) {
    console.log("Error while backing up : \n", e);
    // try to delete data.json if it exists
    if (fs.existsSync("data.json")) {
      fs.unlinkSync("data.json");
    }
  }
};

backup();
