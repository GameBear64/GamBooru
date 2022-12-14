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
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(Flaggable),
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    resolved: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

exports.FlagModel = mongoose.model("Flag", flagSchema);
