const mongoose = require("mongoose");
const { FlagModel } = require("./Flag");

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    flag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flag" }],
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: "History" }],
    deletionVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

commentSchema.pre("deleteOne", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  await FlagModel.deleteMany({ _id: { $in: doc.flag } });

  next();
});

commentSchema.pre("deleteMany", async function (next) {
  const doc = await this.model.find(this.getQuery());
  const targets = doc
    .map((doc) => doc.flag)
    .reduce((acc, flags) => acc.concat(flags));

  await FlagModel.deleteMany({ _id: { $in: targets } });

  next();
});

exports.CommentModel = mongoose.model("Comment", commentSchema);
