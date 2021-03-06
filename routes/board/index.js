const express = require("express");
const verifyToken = require("../../middleware/verifyToken");
const { createBoardRoute } = require("./create");
const { deleteBoardRoute } = require("./delete");
const {
  getAllUserBoardsRoute,
  getSingleBoardRoute,
  getPublicUserBoardsRoute,
} = require("./get");
const {
  joinBoardRoute,
  updateBoardRoute,
  sendBoardInviteRoute,
  removeBoardMemberRoute,
} = require("./update");

const boardRouter = express.Router();

boardRouter.get("/public/:userId", getPublicUserBoardsRoute);
boardRouter.get("/all", verifyToken, getAllUserBoardsRoute);
boardRouter.post("/create", verifyToken, createBoardRoute);
boardRouter.post("/invite", sendBoardInviteRoute);
boardRouter.post("/join", verifyToken, joinBoardRoute);
boardRouter.post("/member/remove", verifyToken, removeBoardMemberRoute);
boardRouter.get("/:id", getSingleBoardRoute);
boardRouter.put("/:id", verifyToken, updateBoardRoute);
boardRouter.delete("/:id", verifyToken, deleteBoardRoute);

module.exports = boardRouter;
