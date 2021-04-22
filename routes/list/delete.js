const { deleteList } = require("../../controllers/listController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.deleteListRoute = async (req, res) => {
  const result = await deleteList(req.params.id);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
