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
    category: [
      {
        type: String,
        enum: Object.values(TagCategories),
        default: TagCategories.Tag,
      },
    ],
    example: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
    locked: { type: Boolean, default: false },
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: "History" }],
    flagged: [String],
  },
  { timestamps: true }
);

exports.TagModel = mongoose.model("Tag", tagSchema);
