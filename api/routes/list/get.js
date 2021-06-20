const { getList, getAllLists } = require("../../controllers/listController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.getSingleListRoute = async (req, res) => {
  const id = req.params.id;

  const result = await getList(id);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};

exports.getAllListsRoute = async (req, res) => {
  const result = await getAllLists();

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
