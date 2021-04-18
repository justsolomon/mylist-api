const { createTodo } = require("../../controllers/todoController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.createTodoRoute = async (req, res) => {
  const { listId, boardId } = req.params;
  const result = await createTodo(listId, boardId, req.body);

  res.status(getHTTPStatus(result, 201, 400)).send(result);
};
