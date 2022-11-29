const router = require("express").Router();
const { ObjectId } = require("mongodb");

const { CommentModel } = require("../models/Comment");
const { PostModel } = require("../models/Post");
const { FlagModel } = require("../models/Flag");

const { Flaggable } = require("../enums.js");

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
      { body: req.body.content }
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
  .route("/flag/:id")
  .post(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    let newFlag = await FlagModel.create({
      author: req.userInSession.id,
      reason: req.body.reason,
      type: Flaggable.Comment,
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

module.exports = router;