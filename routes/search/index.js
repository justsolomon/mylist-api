const runGlobalSearch = require("../../controllers/searchController");
const { getHTTPStatus } = require("../../utils/getHTTPStatus");

exports.globalSearchRoute = async (req, res) => {
  const result = await runGlobalSearch(req.query.query, req.userId);

  res.status(getHTTPStatus(result, 200, 400)).send(result);
};
