const { createList } = require("../../controllers/listController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.createListRoute = async (req, res) => {
  const result = await createList(req.params.boardId, req.body);

  res.status(getHTTPStatus(result, 201, 400)).send(result);
};
