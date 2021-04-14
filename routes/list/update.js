const { updateList } = require("../../controllers/listController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.updateListRoute = async (req, res) => {
  const id = req.params.id;

  const result = await updateList(id, req.body);
  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
