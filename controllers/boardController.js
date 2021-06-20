const Board = require("../models/boardModel");
const List = require("../models/listModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const config = require("../config");
const boardPaths = require("../utils/boardPaths");
const Todo = require("../models/todoModel");
const sendEmail = require("../utils/sendEmail");

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
    console.error(err);
    return {
      error: "Internal server error",
      message: err.message,
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
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
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
    console.error(err);
    return {
      error: "Internal server error",
      message: err.message,
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

    const checkMembers = () =>
      result.members.find((member) => userId === String(member._id));

    //return error if board is private and user/member ids do not match
    if (
      result.private &&
      userId !== String(result.userId._id) &&
      !checkMembers()
    ) {
      return privateError;
    }

    return result;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const getUserBoards = async (userId) => {
  try {
    const result = await Board.find({ userId }).select("-__v");
    return result;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const getPublicBoards = async (userId) => {
  try {
    const result = await Board.find({ userId, private: false }).select("-__v");
    return result;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const sendBoardInvite = async (
  boardId,
  boardName,
  firstName,
  username,
  recipientAddresses
) => {
  try {
    let recipientNames = [];
    let recipientIds = [];

    //check if recipients exist
    for (let i = 0; i < recipientAddresses.length; i++) {
      const user = await User.findOne({ email: recipientAddresses[i] });
      if (!user)
        return {
          error: `User with email ${recipientAddresses[i]} does not exist`,
        };
      recipientNames.push(user.firstName);
      recipientIds.push(user._id);
    }

    for (let i = 0; i < recipientAddresses.length; i++) {
      const link = `https://mylist-app.netlify.app/board/accept-invite/${recipientIds[0]}/${boardId}/${boardName}/${firstName}`;

      await sendEmail(
        recipientAddresses[i],
        `${firstName} (@${username}) invited you to join the board "${boardName}" on MyList`,
        {
          user: firstName,
          recipient: recipientNames[i],
          board: boardName,
          link,
        },
        "/views/inviteUser.handlebars"
      );
    }

    return { success: "Invites sent successfully" };
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const joinBoard = async (boardId, memberId, userId) => {
  try {
    if (memberId !== userId)
      return { error: "You don't have access to this board" };

    const board = await Board.findByIdAndUpdate(
      boardId,
      {
        $addToSet: { members: memberId },
      },
      { new: true }
    )
      .populate(boardPaths)
      .lean();

    if (!board) return { error: "Board not found" };

    //add board to member's board list
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { boards: boardId } },
      { new: true }
    )
      .populate("boards")
      .select("-password")
      .lean();

    return { ...board, user };
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const removeBoardMember = async (boardId, memberId, userId) => {
  try {
    //check if user is owner of board
    // const boardCheck = await Board.findById(boardId).select("userId");
    // if (String(userId) !== String(boardCheck.userId))
    //   return { error: "You can't remove members" };

    const board = await Board.findByIdAndUpdate(
      boardId,
      {
        $pull: { members: memberId },
      },
      { new: true }
    )
      .populate(boardPaths)
      .lean();

    if (!board) return { error: "Board not found" };

    //remove board from member's board list
    await User.findByIdAndUpdate(memberId, { $pull: { boards: boardId } });

    return board;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
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
  sendBoardInvite,
  joinBoard,
  removeBoardMember,
};
