const Todo = require("../models/todoModel");
const User = require("../models/userModel");

const runGlobalSearch = async (query, userId) => {
  try {
    const $regex = new RegExp(query, "i");

    const user = await User.findById(userId)
      .populate({
        path: "boards",
        select: "background lists title",
        populate: {
          path: "lists",
          select: "todos -_id",
          populate: {
            path: "todos",
            select: "title description listId boardId",
            populate: [
              { path: "boardId", select: "title" },
              { path: "listId", select: "title -_id" },
            ],
          },
        },
      })
      .select("boards");

    let allLists = [];
    let allTodos = [];
    let todoResults = [];
    let boardResults = [];

    for (let board of user.boards) {
      allLists = allLists.concat(board.lists);

      if ($regex.test(board.title)) {
        const { _id, title, background } = board;
        boardResults.push({ _id, title, background });
      }
    }

    for (let list of allLists) {
      allTodos = allTodos.concat(list.todos);
    }

    for (let todo of allTodos) {
      if ($regex.test(todo.title) || $regex.test(todo.description))
        todoResults.push(todo);
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
