const { deleteBoard } = require("../../controllers/boardController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.deleteBoardRoute = async (req, res) => {
  const result = await deleteBoard(req.params.id);

  res.status(getHTTPStatus(result, 204, 400)).send();
};
