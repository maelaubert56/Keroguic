const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

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

const usersRequest = () => {
  const users = [
    {
      username: "root",
      name: "root",
      password: "$2a$10$Buckb7hNhzVxZqswq/mBm.pIyMuX0A2KTElyBYjXxkZw70ks2ncJW",
      privilege: "owner",
      picture: "https://randomuser.me/api/portraits/women/29.jpg",
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
