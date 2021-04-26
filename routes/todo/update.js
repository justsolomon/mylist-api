const {
  updateTodo,
  updateTodoPosition,
  moveTodoToList,
} = require("../../controllers/todoController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.updateTodoRoute = async (req, res) => {
  const id = req.params.id;

  const result = await updateTodo(id, req.body);
  res.status(getHTTPStatus(result, 200, 400)).send(result);
};

exports.updateTodoPositionRoute = async (req, res) => {
  const { index, listId, todoId } = req.params;

  const result = await updateTodoPosition(listId, todoId, Number(index));
  res.status(getHTTPStatus(result, 200, 400)).send(result);
};

exports.moveTodoToListRoute = async (req, res) => {
  const result = await moveTodoToList(req.params);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
