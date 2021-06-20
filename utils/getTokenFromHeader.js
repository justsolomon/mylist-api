const getTokenFromHeader = (authHeader) => {
  return authHeader.replace("Bearer ", "");
};

module.exports = getTokenFromHeader;
