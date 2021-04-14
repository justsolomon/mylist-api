const {
  getUser,
  getAuthenticatedUser,
} = require("../../controllers/userController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.getUserRoute = async (req, res) => {
  const result = await getUser(req.params.username);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};

exports.getAuthUserRoute = async (req, res) => {
  const result = await getAuthenticatedUser(req.userId);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
