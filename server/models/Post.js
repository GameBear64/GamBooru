const mongoose = require("mongoose");
const { ImageModel } = require("./Image");
const { CommentModel } = require("./Comment");
const { FlagModel } = require("./Flag");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    source: String,
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: "History" }],
    flag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flag" }],
  },
  { timestamps: true }
);

postSchema.pre("deleteOne", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  await ImageModel.deleteOne({ id: doc.image });
  await CommentModel.deleteMany({ id: { $in: doc.comments } });
  await FlagModel.deleteMany({ id: { $in: doc.flag } });

  next();
});

exports.PostModel = mongoose.model("Post", postSchema);
