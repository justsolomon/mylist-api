const { updateTodo } = require("../../controllers/todoController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.updateTodoRoute = async (req, res) => {
  const id = req.params.id;

  const result = await updateTodo(id, req.body);
  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
