const mongoose = require("mongoose");

const { Flaggable } = require("../enums.js");

const flagSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(Flaggable),
      required: true,
    },
  },
  { timestamps: true }
);

exports.FlagModel = mongoose.model("Flag", flagSchema);
