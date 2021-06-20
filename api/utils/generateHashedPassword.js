const bcrypt = require("bcryptjs");
const { bcryptSalt } = require("../config");

const generateHashedPassword = (password) => {
  return bcrypt.hashSync(password, bcryptSalt);
};

module.exports = generateHashedPassword;
