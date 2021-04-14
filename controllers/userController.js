const User = require("../models/userModel");

const getUser = async (username) => {
  try {
    const user = await User.findOne({
      username: { $regex: new RegExp(username, "i") },
    })
      .select("-__v -password")
      .populate({
        path: "boards",
        match: { private: false },
      });

    return { data: user };
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

const getAuthenticatedUser = async (id) => {
  try {
    const user = await User.findById(id).select("-password");
    return { data: user };
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

const updateUser = async (id, body) => {
  try {
    // const { name, email } = body;
    // if (email) return { error: "Email can't be changed" };

    const result = await User.findByIdAndUpdate(id, body, {
      new: true,
    }).select("-__v -password");
    return { data: result };
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

module.exports = { getAuthenticatedUser, getUser, updateUser };
