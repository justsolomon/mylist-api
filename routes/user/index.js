const express = require("express");
const verifyToken = require("../../middleware/verifyToken");
const { getAuthUserRoute, getUserRoute } = require("./get");
const { updateUserRoute } = require("./update");

const userRouter = express.Router();

userRouter.get("/", verifyToken, getAuthUserRoute);
userRouter.get("/:username", getUserRoute);
userRouter.put("/update", verifyToken, updateUserRoute);

module.exports = userRouter;
