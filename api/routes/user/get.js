const {
  getUser,
  getAuthenticatedUser,
  searchUsers,
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

exports.searchUsersRoute = async (req, res) => {
  const result = await searchUsers(req.query.query);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
