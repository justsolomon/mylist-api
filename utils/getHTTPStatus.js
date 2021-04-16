exports.getHTTPStatus = (data, successCode, failureCode) => {
  //return unauthorized status if private
  if (data.privateErr) return 403;

  if (data.errors || data.error) {
    return data.error === "Internal server error" ? 500 : failureCode;
  } else return successCode;
};
