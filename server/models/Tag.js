const { TagCategories } = require("../enums.js");
const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(TagCategories),
      default: TagCategories.Tag,
    },
    count: {
      type: Number,
      default: 0,
    },
    example: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: "History" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    flag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flag" }],
    lockVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deletionVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

exports.TagModel = mongoose.model("Tag", tagSchema);
