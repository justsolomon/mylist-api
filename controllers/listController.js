const Board = require("../models/boardModel");
const List = require("../models/listModel");
const Todo = require("../models/todoModel");
const boardPaths = require("../utils/boardPaths");
const getUpdatedArray = require("../utils/getUpdatedArray");
const getUpdatedBoard = require("../utils/getUpdatedBoard");

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
    ).populate(boardPaths);

    return result;
  } catch (err) {
    console.error(err);
    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const updateList = async (id, body) => {
  try {
    const result = await List.findByIdAndUpdate(id, body);

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

const deleteList = async (id) => {
  try {
    const result = await List.findByIdAndDelete(id);

    //delete todos in the list
    await Todo.deleteMany({ listId: id });

    //get updated board data
    const board = await Board.findByIdAndUpdate(
      result.boardId,
      {
        $pull: { lists: result._id },
      },
      { new: true }
    ).populate(boardPaths);

    return board;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const getList = async (id) => {
  try {
    const result = await List.findById(id).populate("todos", "-__v");
    return result;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const updateListPosition = async (boardId, listId, newIndex) => {
  try {
    const board = await Board.findById(boardId).select("lists").lean();

    let lists = board.lists;
    const updatedLists = getUpdatedArray(
      lists,
      lists.findIndex((id) => id.toHexString() === listId),
      newIndex
    );

    if (!updatedLists) return { error: "Invalid index specified" };

    //update lists array in the board with the list id
    const result = await Board.findByIdAndUpdate(
      boardId,
      { $set: { lists: updatedLists } },
      { new: true }
    ).populate(boardPaths);

    return result;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const getAllLists = async () => {
  try {
    const result = await List.find().populate("todos", "-__v");
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
  createList,
  getList,
  deleteList,
  getAllLists,
  updateList,
  updateListPosition,
};
