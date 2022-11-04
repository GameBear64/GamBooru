const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    favorite: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: Number,
        default: 0,
      },
    ],
    like: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: Number,
        default: 0,
      },
    ],
    dislike: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: Number,
        default: 0,
      },
    ],
  },
  { timestamps: true }
);

exports.RatingModel = mongoose.model("Rating", ratingSchema);
