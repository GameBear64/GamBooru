const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    upVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

exports.CommentModel = mongoose.model("Comment", commentSchema);
