const mongoose = require("mongoose");

const listSchema = mongoose.Schema({
  title: { type: String, required: true },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Board",
  },
});

const List = mongoose.model("List", listSchema);

module.exports = List;
