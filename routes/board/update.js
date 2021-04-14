const { updateBoard } = require("../../controllers/boardController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.updateBoardRoute = async (req, res) => {
  const id = req.params.id;

  const result = await updateBoard(id, req.body);
  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
