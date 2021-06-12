const List = require("../models/listModel");
const Todo = require("../models/todoModel");
const getUpdatedArray = require("../utils/getUpdatedArray");
const getUpdatedBoard = require("../utils/getUpdatedBoard");

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
    const result = await List.findByIdAndUpdate(listId, {
      $push: { todos: newTodo._id },
    });

    const board = await getUpdatedBoard(result.boardId);

    return board;
  } catch (err) {
    console.error(err);
    return {
      error: "Internal server error",
      message: err.message,
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

    const board = await getUpdatedBoard(result.boardId);
    const list = await List.findById(result.listId).select("title -_id").lean();

    return { ...result, board, list };
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const updateTodoPosition = async (listId, todoId, newIndex) => {
  try {
    const list = await List.findById(listId).select("todos").lean();

    let todos = list.todos;
    const updatedTodos = getUpdatedArray(
      todos,
      todos.findIndex((id) => id.toHexString() === todoId),
      newIndex
    );

    if (!updatedTodos) return { error: "Invalid index specified" };

    //update todos array in the list
    const result = await List.findByIdAndUpdate(listId, {
      $set: { todos: updatedTodos },
    });

    const board = await getUpdatedBoard(result.boardId);

    return board;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const moveTodoToList = async (params) => {
  try {
    const { index, newListId, oldListId, todoId } = params;

    //delete todo ref from old list
    await List.findByIdAndUpdate(oldListId, { $pull: { todos: todoId } });

    //add todo to index in the new list
    const newList = await List.findByIdAndUpdate(newListId, {
      $push: { todos: { $each: [todoId], $position: Number(index) } },
    });

    const board = await getUpdatedBoard(newList.boardId);

    return board;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const deleteTodo = async (id) => {
  try {
    const result = await Todo.findByIdAndDelete(id);

    const board = await getUpdatedBoard(result.boardId);

    return board;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const getTodo = async (id) => {
  try {
    const result = await Todo.findById(id)
      .populate([
        { path: "boardId", select: "background title" },
        { path: "listId", select: "title" },
      ])
      .select("-__v")
      .lean();

    if (!result) return { error: "Card does not exist" };

    return result;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const getAllTodos = async () => {
  try {
    const result = await Todo.find();
    return result;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

module.exports = {
  createTodo,
  updateTodo,
  deleteTodo,
  getTodo,
  getAllTodos,
  updateTodoPosition,
  moveTodoToList,
};
