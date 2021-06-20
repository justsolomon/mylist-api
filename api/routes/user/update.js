const { updateUser } = require("../../controllers/userController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.updateUserRoute = async (req, res) => {
  const result = await updateUser(req.userId, req.body);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
