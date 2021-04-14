const { refreshTokenController } = require("../../controllers/authController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.refreshTokenRoute = async (req, res) => {
  const result = await refreshTokenController(
    req.cookies["refreshToken"],
    req.ip,
    res
  );

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
