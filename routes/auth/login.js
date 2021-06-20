const { loginUser } = require("../../controllers/authController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.loginUserRoute = async (req, res) => {
  const result = await loginUser(req.body, req.ip, res);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
