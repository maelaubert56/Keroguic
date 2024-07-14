const jwt = require("jsonwebtoken");
// find secret key in .env file
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token || token === "null") {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    prisma.users
      .findUnique({
        where: { username: user.username },
      })
      .then((user2) => {
        if (!user2) {
          console.log("User not found");
          return res.status(403).json({ message: "Forbidden: Invalid token" });
        } else if (user.password !== user2.password) {
          console.log("Invalid password");
          return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        console.log(`Ok (${user2.username})\n`);
        req.user = user2;
        next();
      });
  });
}

module.exports = authenticateToken;
