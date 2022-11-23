const { Roles } = require("../enums.js");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: [3, "Your name is too short"],
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Try something stronger"],
    },
    profilePicture: {
      type: String,
      default: null,
    },
    biography: {
      type: String,
      default: null,
      maxLength: [2500, "Too long"],
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.User,
    },
    links: [{ icon: String, heading: String, target: String }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    inbox: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    savedSearches: [String],
  },
  { timestamps: true }
);

exports.UserModel = mongoose.model("User", userSchema);
