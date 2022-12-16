const router = require("express").Router();
const { ObjectId } = require("mongodb");

const { CommentModel } = require("../models/Comment");
const { PostModel } = require("../models/Post");
const { FlagModel } = require("../models/Flag");

const { Flaggable } = require("../enums.js");

router
  .route("/")
  .get(async (req, res) => {
    let comments = await CommentModel.find({})
      .populate("author", "username profilePicture")
      .populate({
        path: "post",
        select: ["image"],
        populate: {
          path: "image",
          select: ["thumbnail"],
        },
      })
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).send(comments);
  })

  .all((req, res) => {
    res.status(405).send({ message: "Use another method" });
  });

router.route("/parent/:id").get(async (req, res) => {
  let comment = await CommentModel.findOne({ _id: ObjectId(req.params.id) });

  res.status(200).send(comment.post);
});

router
  .route("/like/:id")
  .post(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    let comment = await CommentModel.findOne({ _id: ObjectId(req.params.id) });

    if (comment.likes.includes(req.userInSession.id)) {
      await comment.update(
        { $pull: { likes: req.userInSession.id } },
        { timestamps: false }
      );
      res.status(200).send({ message: "Removed like" });
    } else {
      await comment.update(
        { $push: { likes: req.userInSession.id } },
        { timestamps: false }
      );
      res.status(200).send({ message: "Liked" });
    }
  })
  .all((req, res) => {
    res.status(405).send({ message: "This route is POST only" });
  });

router
  .route("/voteDelete/:id")
  .post(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    let comment = await CommentModel.findOne({ _id: ObjectId(req.params.id) });

    if (comment.deletionVotes.length > 5) {
      await CommentModel.deleteOne({ _id: ObjectId(req.params.id) });

      return res.status(200).send({
        message:
          "Comment has been deleted due to too many people voting for deletion",
      });
    }

    await comment.update(
      { $addToSet: { deletionVotes: ObjectId(req.userInSession.id) } },
      { timestamps: false }
    );

    return res.status(200).send({
      message:
        "Voted, comment will be deleted when enough people have voted for it's deletion",
    });
  })
  .all((req, res) => {
    res.status(405).send({ message: "Use another method" });
  });

router
  .route("/flag/:id")
  .post(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    let newFlag = await FlagModel.create({
      author: req.userInSession.id,
      reason: req.body.reason,
      type: Flaggable.Comment,
      parent: ObjectId(req.params.id),
    });

    await CommentModel.updateOne(
      { _id: ObjectId(req.params.id) },
      { $push: { flag: newFlag } },
      { timestamps: false }
    );
    res.status(200).send({ message: "Liked" });
  })
  .all((req, res) => {
    res.status(405).send({ message: "This route is POST only" });
  });

router
  .route("/:id")
  .post(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    let comment = await CommentModel.create({
      author: req.userInSession.id,
      body: req.body.comment,
      post: req.params.id,
    });

    await PostModel.updateOne(
      { _id: ObjectId(req.params.id) },
      { $push: { comments: comment._id } },
      { timestamps: false }
    );

    res.status(200).send({ message: "Entry Created" });
  })
  .patch(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    await CommentModel.updateOne(
      { _id: ObjectId(req.params.id) },
      { body: req.body.content, $set: { deletionVotes: [] } }
    );

    res.status(200).send({ message: "Patched" });
  })
  .delete(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    await CommentModel.deleteOne({ _id: ObjectId(req.params.id) });

    res.status(200).send({ message: "Deleted" });
  })
  .all((req, res) => {
    res.status(405).send({ message: "Use another method" });
  });

module.exports = router;
