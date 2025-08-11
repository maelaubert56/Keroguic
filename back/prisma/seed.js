const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

const fs = require("fs");
const path = require("path");

let errorCount = 0;

const handleError = (e, obj = undefined) => {
  if (errorCount > 3) return;
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      // return console.error(`Unique constraint failed on the fields: [${e.meta.target}], the object probably exists already.`);
      return;
    } else if (e.code === "P2025") {
      errorCount++;
      console.log(obj);
      console.error(
        `An operation failed because it depends on one or more records that were required but not found. ${e.meta.cause}`
      );
      throw e;
    }
  }
  errorCount++;

  console.log(obj);
  if (e instanceof Prisma.PrismaClientValidationError) {
    return console.error(e.message);
  }

  console.error(e.message);
  throw e;
};

const deleteAll = async () => {
  // delete all the posts
  await prisma.posts.deleteMany({});
  // delete all the gallery
  await prisma.gallery.deleteMany({});
  // delete all the users
  await prisma.users.deleteMany({});
  // delete all the media in the /uploads/gallery folder

  const gallery = "./uploads/gallery";
  const pp = "./uploads/pp";
  const filesGallery = fs.readdirSync(gallery);
  const filesPp = fs.readdirSync(pp);
  filesGallery.forEach((file) => {
    if (file !== ".gitkeep") {
      fs.unlinkSync(path.join(gallery, file));
    }
  });
  filesPp.forEach((file) => {
    if (file !== "default_pp.png" && file !== ".gitkeep") {
      fs.unlinkSync(path.join(pp, file));
    }
  });
};

const usersRequest = () => {
  const users = [
    {
      username: "root",
      name: "root",
      password: "$2a$10$q3sKE2FtgjCkIipd7Ahfe.DqXOnd7QUnvoghnRAnji0ZyRigEZQcu",
      privilege: "owner",
      picture: "default_pp.png",
    },
  ];

  users.forEach(async (user) => {
    try {
      await prisma.users.create({
        data: {
          username: user.username,
          name: user.name,
          password: user.password,
          privilege: user.privilege,
          picture: user.picture,
        },
      });
    } catch (e) {
      handleError(e, user);
    }
  });
};

const main = async () => {
  await deleteAll();
  await usersRequest();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
