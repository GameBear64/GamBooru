const mongoose = require("mongoose");

const { Roles } = require("../enums.js");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Your name is too short"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: [8, "Try something stronger"],
    },
    profilePicture: {
      type: String,
      default: null,
    },
    biography: {
      type: String,
      default: null,
      trim: true,
      maxLength: [2500, "Too long"],
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.User,
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: "History" }],
    flag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flag" }],
  },
  { timestamps: true }
);

exports.UserModel = mongoose.model("User", userSchema);
