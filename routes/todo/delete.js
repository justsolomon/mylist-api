const { deleteTodo } = require("../../controllers/todoController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.deleteTodoRoute = async (req, res) => {
  const result = await deleteTodo(req.params.id);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
