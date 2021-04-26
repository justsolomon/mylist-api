const Board = require("../models/boardModel");
const boardPaths = require("./boardPaths");

const getUpdatedBoard = async (id) => {
  const board = await Board.findById(id).populate(boardPaths);

  return board;
};

module.exports = getUpdatedBoard;
