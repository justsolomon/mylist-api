const {
  updateBoard,
  sendBoardInvite,
  removeBoardMember,
  joinBoard,
} = require("../../controllers/boardController");
const checkEmptyOrNullProps = require("../../utils/checkEmptyOrNullProps");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.updateBoardRoute = async (req, res) => {
  const id = req.params.id;

  const result = await updateBoard(id, req.body);
  res.status(getHTTPStatus(result, 200, 400)).send(result);
};

exports.sendBoardInviteRoute = async (req, res) => {
  const { boardId, boardName, firstName, username, recipientAddresses } =
    req.body;

  const result = await sendBoardInvite(
    boardId,
    boardName,
    firstName,
    username,
    recipientAddresses
  );

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};

exports.joinBoardRoute = async (req, res) => {
  const { boardId, memberId } = req.body;

  const { status, message } = checkEmptyOrNullProps(req.body, [
    "boardId",
    "memberId",
  ]);

  if (status === "error") {
    return res.status(400).send({ error: message });
  }

  const result = await joinBoard(boardId, memberId, req.userId);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};

exports.removeBoardMemberRoute = async (req, res) => {
  const { boardId, memberId } = req.body;

  const { status, message } = checkEmptyOrNullProps(req.body, [
    "boardId",
    "memberId",
  ]);

  if (status === "error") {
    return res.status(400).send({ error: message });
  }

  const result = await removeBoardMember(boardId, memberId, req.userId);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
