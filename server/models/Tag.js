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
    example: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
    locked: { type: Boolean, default: false },
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: "History" }],
    flagged: [String],
  },
  { timestamps: true }
);

exports.TagModel = mongoose.model("Tag", tagSchema);
