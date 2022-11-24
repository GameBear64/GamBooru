const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    source: String,
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    rating: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
    views: { type: Number, default: 0 },
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: "History" }],
  },
  { timestamps: true }
);

exports.PostModel = mongoose.model("Post", postSchema);
