const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    type: {
      type: String, // admin | guest | user
      default: "user"
    }
  },
  {
    timestamps: true // creates createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("User", UserSchema);
