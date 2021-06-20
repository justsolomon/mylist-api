const {
  updateList,
  updateListPosition,
} = require("../../controllers/listController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.updateListRoute = async (req, res) => {
  const id = req.params.id;

  const result = await updateList(id, req.body);
  res.status(getHTTPStatus(result, 200, 400)).send(result);
};

exports.updateListPositionRoute = async (req, res) => {
  const { index, listId, boardId } = req.params;

  const result = await updateListPosition(boardId, listId, Number(index));
  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
