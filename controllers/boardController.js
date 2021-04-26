const Board = require("../models/boardModel");
const List = require("../models/listModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const config = require("../config");
const boardPaths = require("../utils/boardPaths");
const Todo = require("../models/todoModel");

const createBoard = async (userId, body) => {
  try {
    const board = new Board({
      ...body,
      starred: false,
      userId,
    });

    const savedBoard = await board.save();

    //update boards array in the user with the board id
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { boards: savedBoard._id } },
      { new: true }
    )
      .populate("boards")
      .select("-password");

    if (!user) return { error: `User with id ${userId} doesn't exist` };

    const boardData = await Board.findById(savedBoard._id)
      .populate(boardPaths)
      .lean();

    return { ...boardData, user };
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
    if (body.title === "") return { error: "Title cannot be empty" };

    const result = await Board.findByIdAndUpdate(id, body, {
      new: true,
    })
      .populate(boardPaths)
      .lean();

    const user = await User.findById(result.userId)
      .populate("boards")
      .select("-password")
      .lean();

    return { ...result, user };
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
    //delete lists and todos in the board
    await List.deleteMany({ boardId: id });
    await Todo.deleteMany({ boardId: id });

    const result = await Board.findByIdAndDelete(id);

    return result;
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

const getBoard = async (id, authHeader) => {
  try {
    const result = await Board.findById(id).populate(boardPaths);

    let privateError = { error: "This board is private", privateErr: true };

    //get userId from auth token
    let userId;
    if (authHeader) {
      userId = jwt.verify(getTokenFromHeader(authHeader), config.secret).id;
    } else if (result.private && !authHeader)
      return { error: "No token provided", privateErr: true };

    //return error if board is private and user ids do not match
    if (result.private && userId !== result.userId) {
      return privateError;
    }

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
