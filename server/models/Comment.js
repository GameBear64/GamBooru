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
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    flag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flag" }],
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: "History" }],
  },
  { timestamps: true }
);

commentSchema.pre("deleteOne", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  await FlagModel.deleteMany({ id: { $in: doc.flag } });

  next();
});

exports.CommentModel = mongoose.model("Comment", commentSchema);
