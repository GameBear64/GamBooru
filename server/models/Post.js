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
    source: { type: String, trim: true, default: "unknown" },
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
    deletionVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

postSchema.pre("deleteOne", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  await ImageModel.deleteOne({ _id: doc.image });
  await CommentModel.deleteMany({ _id: { $in: doc.comments } });
  await FlagModel.deleteMany({ _id: { $in: doc.flag } });

  next();
});

exports.PostModel = mongoose.model("Post", postSchema);
