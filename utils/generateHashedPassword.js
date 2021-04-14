const bcrypt = require("bcryptjs");

const generateHashedPassword = (password) => {
  return bcrypt.hashSync(password, process.env.BCRYPT_SALT);
};

module.exports = generateHashedPassword;
