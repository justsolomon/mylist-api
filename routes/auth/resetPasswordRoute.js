const { resetPassword } = require("../../controllers/authController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.resetPasswordRoute = async (req, res) => {
  const result = await resetPassword(req.body);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
