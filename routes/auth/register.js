const { registerUser } = require("../../controllers/authController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.registerUserRoute = async (req, res) => {
  const result = await registerUser(req.body, req.ip, res);

  res.status(getHTTPStatus(result, 201, 400)).send(result);
};
