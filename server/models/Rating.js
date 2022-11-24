const mongoose = require("mongoose");

const { Ratings } = require("../enums.js");

const ratingSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      type: Number,
      default: 0,
    },
    rating: {
      type: String,
      enum: Object.values(Ratings),
    },
  },
  { timestamps: true }
);

exports.RatingModel = mongoose.model("Rating", ratingSchema);
