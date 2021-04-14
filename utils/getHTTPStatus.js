exports.getHTTPStatus = (data, successCode, failureCode) => {
  if (data.errors || data.error) {
    return data.error === "Internal server error" ? 500 : failureCode;
  } else return successCode;
};
