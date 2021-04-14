const Board = require("../models/boardModel");
const List = require("../models/listModel");
const Todo = require("../models/todoModel");

const createList = async (boardId, body) => {
  try {
    const list = new List({
      ...body,
      boardId,
    });

    const newList = await list.save();

    //update lists array in the board with the list id
    const result = await Board.findByIdAndUpdate(
      boardId,
      { $push: { lists: newList._id } },
      { new: true }
    ).populate("lists");

    return { data: result };
  } catch (err) {
    return err;
  }
};

const updateList = async (id, body) => {
  try {
    const result = await List.findByIdAndUpdate(id, body);
    return { data: result };
  } catch (err) {
    return err;
  }
};

const deleteList = async (id) => {
  try {
    const result = await List.findByIdAndDelete(id);

    //delete todos in the list
    const deletedTodos = await Todo.deleteMany({ listId: id });

    return { data: result };
  } catch (err) {
    return err;
  }
};

const getList = async (id) => {
  try {
    const result = await List.findById(id).populate("todos", "-__v");
    return { data: result };
  } catch (err) {
    return err;
  }
};

const getAllLists = async () => {
  try {
    const result = await List.find().populate("todos", "-__v");
    return { data: result };
  } catch (err) {
    return err;
  }
};

module.exports = { createList, getList, deleteList, getAllLists, updateList };
