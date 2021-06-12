module.exports = [
  {
    path: "lists",
    select: "-__v",
    populate: {
      path: "todos",
      select: "-__v",
    },
  },
  {
    path: "members",
    select: "imageUrl fullName username email",
  },
  { path: "userId", select: "imageUrl fullName username email firstName" },
];
