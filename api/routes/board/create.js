const { createBoard } = require("../../controllers/boardController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.createBoardRoute = async (req, res) => {
  const result = await createBoard(req.userId, req.body);

  res.status(getHTTPStatus(result, 201, 400)).send(result);
};
