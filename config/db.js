const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.connect("mongodb://localhost:27017/chatapp");
  console.log("MongoDB connected");
};