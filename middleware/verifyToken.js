const jwt = require("jsonwebtoken");
const config = require("../config");

const verifyToken = (req, res, next) => {
  let authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).send({ error: "No token provided." });

  const token = req.headers["authorization"].replace("Bearer ", "");
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err)
      return res.status(500).send({ error: "Failed to authenticate token." });

    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
