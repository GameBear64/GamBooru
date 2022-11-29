const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    body: {
      type: String,
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    flag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flag" }],
  },
  { timestamps: true }
);

exports.CommentModel = mongoose.model("Comment", commentSchema);
