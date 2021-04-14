const { deleteBoard } = require("../../controllers/boardController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.deleteBoardRoute = async (req, res) => {
  const id = req.params.id;
  const result = await deleteBoard(id);

  res.status(getHTTPStatus(result, 204, 400)).send();
};
