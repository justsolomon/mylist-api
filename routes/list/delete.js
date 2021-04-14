const { deleteList } = require("../../controllers/listController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.deleteListRoute = async (req, res) => {
  const id = req.params.id;
  const result = await deleteList(id);

  res.status(getHTTPStatus(result, 204, 400)).send();
};
