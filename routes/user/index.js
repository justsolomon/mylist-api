const express = require("express");
const verifyToken = require("../../middleware/verifyToken");
const { getAuthUserRoute, getUserRoute, searchUsersRoute } = require("./get");
const { updateUserRoute } = require("./update");

const userRouter = express.Router();

userRouter.get("/", verifyToken, getAuthUserRoute);
userRouter.get("/search", searchUsersRoute);
userRouter.get("/:username", getUserRoute);
userRouter.put("/update", verifyToken, updateUserRoute);

module.exports = userRouter;
