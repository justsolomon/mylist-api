const mongoose = require("mongoose");

const boardSchema = mongoose.Schema({
  title: { type: String, required: true },
  private: { type: Boolean, required: true },
  fullBackground: { type: String, required: true },
  background: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  starred: { type: Boolean, required: true },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
    },
  ],
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
