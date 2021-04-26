const mongoose = require("mongoose");

const boardSchema = mongoose.Schema({
  title: { type: String, required: true },
  private: { type: Boolean, required: true },
  fullBackground: { type: String, required: true },
  background: { type: String, required: true },
  userId: { type: String, required: true },
  starred: { type: Boolean, required: true },
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
