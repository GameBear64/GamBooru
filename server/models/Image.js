const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // name: {
    //   type: String,
    //   required: true,
    // },
    md5: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

exports.ImageModel = mongoose.model("Image", imageSchema);
