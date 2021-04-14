exports.getHTTPStatus = (data, successCode, failureCode) => {
  if (data.errors || data.error) return failureCode;
  else return successCode;
};
