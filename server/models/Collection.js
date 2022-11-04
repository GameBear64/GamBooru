const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    rating: { type: mongoose.Schema.Types.ObjectId, ref: "Rating" },
    views: Number,
  },
  { timestamps: true }
);

exports.CollectionModel = mongoose.model("Collection", collectionSchema);
