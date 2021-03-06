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

    return user;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const getAuthenticatedUser = async (id) => {
  try {
    const user = await User.findById(id).select("-password").populate("boards");
    return user;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
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
    return result;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

const searchUsers = async (query) => {
  try {
    const $regex = new RegExp(query, "i");
    const result = await User.find({
      $or: [{ username: { $regex } }, { email: { $regex } }],
    }).select("email username imageUrl");

    return result;
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
      message: err.message,
    };
  }
};

module.exports = { getAuthenticatedUser, getUser, updateUser, searchUsers };
