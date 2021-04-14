const { deleteTodo } = require("../../controllers/todoController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.deleteTodoRoute = async (req, res) => {
  const id = req.params.id;
  const result = await deleteTodo(id);

  res.status(getHTTPStatus(result, 204, 400)).send();
};
