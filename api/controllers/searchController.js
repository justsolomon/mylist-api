const Todo = require("../models/todoModel");
const User = require("../models/userModel");

const runGlobalSearch = async (query, userId) => {
  try {
    const $regex = new RegExp(query, "i");

    const user = await User.findById(userId)
      .populate({
        path: "boards",
        select: "background title",
      })
      .select("boards");

    const boardResults = user.boards.filter((board) =>
      $regex.test(board.title)
    );

    let todoResults = [];

    for (let i = 0; i < user.boards.length; i++) {
      let todos = await Todo.find({
        boardId: user.boards[i]._id,
        $or: [{ title: { $regex } }, { description: { $regex } }],
      })
        .populate([
          { path: "boardId", select: "title private" },
          { path: "listId", select: "title" },
        ])
        .select("title description listId boardId");

      todoResults = todoResults.concat(todos);
    }

    return { boards: boardResults, todos: todoResults };
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

module.exports = runGlobalSearch;
