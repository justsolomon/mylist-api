const List = require("../models/listModel");
const Todo = require("../models/todoModel");

const createTodo = async (listId, body) => {
  try {
    const todo = new Todo({
      ...body,
      listId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const newTodo = await todo.save();

    //update todos array in the board with the todo id
    const result = await List.findByIdAndUpdate(
      listId,
      { $push: { todos: newTodo._id } },
      { new: true }
    ).populate("todos");

    return { data: result.todos };
  } catch (err) {
    return err;
  }
};

const updateTodo = async (id, body) => {
  try {
    const updatedTodo = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const result = await Todo.findByIdAndUpdate(id, updatedTodo, { new: true });
    return { data: result };
  } catch (err) {
    return err;
  }
};

const deleteTodo = async (id) => {
  try {
    const result = await Todo.findByIdAndDelete(id);
    return { data: result };
  } catch (err) {
    return err;
  }
};

const getTodo = async (id) => {
  try {
    const result = await Todo.findById(id);
    return { data: result };
  } catch (err) {
    return err;
  }
};

const getAllTodos = async () => {
  try {
    const result = await Todo.find();
    return { data: result };
  } catch (err) {
    return err;
  }
};

module.exports = { createTodo, updateTodo, deleteTodo, getTodo, getAllTodos };
