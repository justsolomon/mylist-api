const express = require("express");
const verifyToken = require("../../middleware/verifyToken");
const { createTodoRoute } = require("./create");
const { deleteTodoRoute } = require("./delete");
const { getAllTodosRoute, getSingleTodoRoute } = require("./get");
const {
  updateTodoRoute,
  updateTodoPositionRoute,
  moveTodoToListRoute,
} = require("./update");

const todoRouter = express.Router();

todoRouter.get("/:id", getSingleTodoRoute);
todoRouter.get("/todos", getAllTodosRoute);
todoRouter.post("/create/:listId/:boardId", verifyToken, createTodoRoute);
todoRouter.put("/:id", verifyToken, updateTodoRoute);
todoRouter.put("/:listId/:todoId/:index", verifyToken, updateTodoPositionRoute);
todoRouter.put(
  "/:oldListId/:newListId/:todoId/:index",
  verifyToken,
  moveTodoToListRoute
);
todoRouter.delete("/:id", verifyToken, deleteTodoRoute);

module.exports = todoRouter;
