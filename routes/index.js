const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const { loginUserRoute } = require("./auth/login");
const { refreshTokenRoute } = require("./auth/refreshToken");
const { registerUserRoute } = require("./auth/register");
const { requestResetPasswordRoute } = require("./auth/requestPasswordReset");
const { resetPasswordRoute } = require("./auth/resetPasswordRoute");
const boardRouter = require("./board");
const listRouter = require("./list");
const { globalSearchRoute } = require("./search");
const todoRouter = require("./todo");
const userRouter = require("./user");

const router = express.Router();

//use routes
router.use("/todo", todoRouter);
router.use("/list", listRouter);
router.use("/board", boardRouter);
router.use("/user", userRouter);

//auth routes
router.post("/signup", registerUserRoute);
router.post("/login", loginUserRoute);
router.post("/refresh-token", refreshTokenRoute);
router.post("/reset-password", requestResetPasswordRoute);
router.put("/reset-password", resetPasswordRoute);

//search
router.get("/search", verifyToken, globalSearchRoute);

module.exports = router;
