const express = require("express");
const verifyToken = require("../../middleware/verifyToken");
const { createListRoute } = require("./create");
const { deleteListRoute } = require("./delete");
const { getAllListsRoute, getSingleListRoute } = require("./get");
const { updateListRoute, updateListPositionRoute } = require("./update");

const listRouter = express.Router();

listRouter.post("/create/:boardId", verifyToken, createListRoute);
listRouter.get("/lists", getAllListsRoute);
listRouter.get("/:id", getSingleListRoute);
listRouter.put("/:id", verifyToken, updateListRoute);
listRouter.put(
  "/:boardId/:listId/:index",
  verifyToken,
  updateListPositionRoute
);
listRouter.delete("/:id", verifyToken, deleteListRoute);

module.exports = listRouter;
