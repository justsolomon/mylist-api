const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  secret: process.env.JWT_SECRET,
  bcryptSalt: Number(process.env.BCRYPT_SALT),
};
