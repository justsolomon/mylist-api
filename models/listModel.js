const mongoose = require("mongoose");

const listSchema = mongoose.Schema({
  title: { type: String, required: true },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
  boardId: { type: String, required: true },
});

const List = mongoose.model("List", listSchema);

module.exports = List;
