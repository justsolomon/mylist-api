const Board = require("../models/boardModel");
const List = require("../models/listModel");
const Todo = require("../models/todoModel");
const boardPaths = require("../utils/boardPaths");

const createTodo = async (listId, boardId, body) => {
  try {
    const todo = new Todo({
      ...body,
      listId,
      boardId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const newTodo = await todo.save();

    //update todos array in the board with the todo id
    const result = await List.findByIdAndUpdate(
      listId,
      { $push: { todos: newTodo._id } },
      { new: true }
    );

    //get updated board data
    const board = await Board.findById(result.boardId).populate(boardPaths);

    return board;
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

const updateTodo = async (id, body) => {
  try {
    const updatedTodo = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const result = await Todo.findByIdAndUpdate(id, updatedTodo, {
      new: true,
    }).lean();

    //get updated board data
    const board = await Board.findById(result.boardId).populate(boardPaths);

    return { ...result, board };
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

const deleteTodo = async (id) => {
  try {
    const result = await Todo.findByIdAndDelete(id);

    //get updated board data
    const board = await Board.findById(result.boardId).populate(boardPaths);

    return board;
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

const getTodo = async (id) => {
  try {
    const result = await Todo.findById(id).select("-__v").lean();

    const list = await List.findById(result.listId).select("title -_id").lean();

    return { ...result, list };
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

const getAllTodos = async () => {
  try {
    const result = await Todo.find();
    return result;
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

module.exports = { createTodo, updateTodo, deleteTodo, getTodo, getAllTodos };
