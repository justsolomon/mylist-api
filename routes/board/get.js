const {
  getBoard,
  getUserBoards,
  getPublicBoards,
} = require("../../controllers/boardController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.getSingleBoardRoute = async (req, res) => {
  const id = req.params.id;

  const result = await getBoard(id);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};

exports.getAllUserBoardsRoute = async (req, res) => {
  const result = await getUserBoards(req.userId);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};

exports.getPublicUserBoardsRoute = async (req, res) => {
  const result = await getPublicBoards(req.params.userId);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
