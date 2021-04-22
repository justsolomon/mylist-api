module.exports = {
  path: "lists",
  select: "-__v",
  populate: {
    path: "todos",
    select: "-__v",
  },
};
