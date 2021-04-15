const Board = require("../models/boardModel");
const List = require("../models/listModel");
const User = require("../models/userModel");

const createBoard = async (userId, body) => {
  try {
    const board = new Board({
      ...body,
      userId,
    });

    const newBoard = await board.save();

    //update boards array in the user with the board id
    const result = await User.findByIdAndUpdate(
      userId,
      { $push: { boards: newBoard._id } },
      { new: true }
    )
      .populate("boards")
      .select("-password");

    if (!result) return { error: `User with id ${userId} doesn't exist` };

    return result;
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

const updateBoard = async (id, body) => {
  try {
    const result = await Board.findByIdAndUpdate(id, body);
    return result;
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

const deleteBoard = async (id) => {
  try {
    const result = await Board.findByIdAndDelete(id);

    //delete todos in the board
    const deletedLists = await List.deleteMany({ boardId: id });
    console.log(result, "deleted lists", deletedLists);

    return result;
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

const getBoard = async (id) => {
  try {
    const result = await Board.findById(id).populate({
      path: "lists",
      select: "-__v",
      populate: {
        path: "todos",
        select: "-__v -description",
      },
    });
    return result;
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

const getUserBoards = async (userId) => {
  try {
    const result = await Board.find({ userId }).select("-__v");
    return result;
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

const getPublicBoards = async (userId) => {
  try {
    const result = await Board.find({ userId, private: false }).select("-__v");
    return result;
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

module.exports = {
  createBoard,
  updateBoard,
  deleteBoard,
  getBoard,
  getUserBoards,
  getPublicBoards,
};
