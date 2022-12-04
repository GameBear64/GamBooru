const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: "History" }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

exports.CollectionModel = mongoose.model("Collection", collectionSchema);
