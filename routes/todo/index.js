const express = require("express");
const verifyToken = require("../../middleware/verifyToken");
const { createTodoRoute } = require("./create");
const { deleteTodoRoute } = require("./delete");
const { getAllTodosRoute, getSingleTodoRoute } = require("./get");
const { updateTodoRoute } = require("./update");

const todoRouter = express.Router();

todoRouter.get("/:id", getSingleTodoRoute);
todoRouter.get("/todos", getAllTodosRoute);
todoRouter.post("/create/:listId", verifyToken, createTodoRoute);
todoRouter.put("/update/:id", verifyToken, updateTodoRoute);
todoRouter.delete("/delete/:id", verifyToken, deleteTodoRoute);

module.exports = todoRouter;
