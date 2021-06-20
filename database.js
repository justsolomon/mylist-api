const mongoose = require("mongoose");

exports.connect = () => {
  try {
    const uri = process.env.MONGO_URI;
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error"));
    db.once("open", () => {
      console.log("MongoDB connected");
    });
  } catch (err) {
    console.log(err);
  }
};
