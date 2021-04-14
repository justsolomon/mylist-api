const { getTodo, getAllTodos } = require("../../controllers/todoController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.getSingleTodoRoute = async (req, res) => {
  const id = req.params.id;

  const result = await getTodo(id);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};

exports.getAllTodosRoute = async (req, res) => {
  const result = await getAllTodos();

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
