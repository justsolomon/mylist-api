const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  listId: { type: String, required: true },
  boardId: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
  },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
