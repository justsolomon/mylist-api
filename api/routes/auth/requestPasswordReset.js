const { requestResetPassword } = require("../../controllers/authController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.requestResetPasswordRoute = async (req, res) => {
  const result = await requestResetPassword(req.body.email);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
