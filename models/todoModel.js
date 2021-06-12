const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Board",
  },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
