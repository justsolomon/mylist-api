const { createTodo } = require("../../controllers/todoController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.createTodoRoute = async (req, res) => {
  const { listId } = req.params;
  const result = await createTodo(listId, req.body);

  res.status(getHTTPStatus(result, 201, 400)).send(result);
};
