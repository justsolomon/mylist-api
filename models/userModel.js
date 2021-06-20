const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  fullName: { type: String, trim: true, required: true },
  username: { type: String, trim: true, unique: true, required: true },
  email: { type: String, trim: true, unique: true, required: true },
  password: { type: String, required: true },
  imageUrl: { type: String, required: true },
  dateJoined: { type: Date, default: Date.now },
  boards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
