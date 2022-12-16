const router = require("express").Router();
const ObjectId = require("mongodb").ObjectId;

const { TagCategories } = require("../enums.js");

const { TagModel } = require("../models/Tag");
const { PostModel } = require("../models/Post");

router.route("/categories").get(async (req, res) => {
  res.status(200).send(Object.keys(TagCategories));
});

router
  .route("/")
  .get(async (req, res) => {
    try {
      let tags = await TagModel.find({})
        .collation({ locale: "en", strength: 2 })
        .sort({ name: 1 });
      let count = await TagModel.count({});
      res.status(200).send({ tags, count });
    } catch (err) {
      return res
        .status(406)
        .send({ message: "Error while fetching posts", error: err });
    }
  })
  .post(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    try {
      await TagModel.create({ ...req.body });
      res.status(200).send({ message: "Entry Created" });
    } catch (err) {
      return res
        .status(406)
        .send({ message: "Error while creating post", error: err });
    }
  })
  .all((req, res) => {
    res.status(405).send({ message: "Use another method" });
  });

router
  .route("/:id")
  .get(async (req, res) => {
    let postCount = await PostModel.find({ tags: req.params.id }).count();

    await TagModel.updateOne(
      { _id: ObjectId(req.params.id) },
      { count: postCount },
      { upsert: true, timestamps: false }
    );

    let tag = await TagModel.findOne({ _id: ObjectId(req.params.id) }).lean();

    if (tag.example.length == 0) {
      let example = await PostModel.find({ tags: req.params.id })
        .sort({ createdAt: -1 })
        .select("_id")
        .limit(10)
        .populate("image", "thumbnail");

      return res.status(200).send({ ...tag, example });
    }

    res.status(200).send(tag);
  })
  .patch(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    try {
      await TagModel.updateOne(
        { _id: ObjectId(req.params.id) },
        { ...req.body, $set: { lockVotes: [], deletionVotes: [] } }
      );

      return res.status(200).send({ message: "Entry patched" });
    } catch (err) {
      return res
        .status(406)
        .send({ message: "Error while editing post", error: err });
    }
  })
  .delete(async (req, res) => {
    let post = await TagModel.findOne({ _id: ObjectId(req.params.id) });

    if (req.userInSession.id !== post.author.toString())
      return res.status(401).send({ message: "Not Authorized" });

    await TagModel.deleteOne({ _id: ObjectId(req.params.id) });

    res.status(200).send({ message: "Entry deleted" });
  })
  .all((req, res) => {
    res.status(405).send({ message: "Use another method" });
  });

router
  .route("/voteLock/:id")
  .post(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    let tag = await TagModel.findOne({ _id: ObjectId(req.params.id) });

    if (tag.lockVotes.length > 5) {
      return res.status(200).send({
        message: "Tag has been locked",
      });
    }

    await tag.update(
      { $addToSet: { lockVotes: ObjectId(req.userInSession.id) } },
      { timestamps: false }
    );

    return res.status(200).send({
      message: "Voted, tag will be locked when enough people have voted.",
    });
  })
  .all((req, res) => {
    res.status(405).send({ message: "Use another method" });
  });

router
  .route("/voteDelete/:id")
  .post(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    let tag = await TagModel.findOne({ _id: ObjectId(req.params.id) });

    if (tag.deletionVotes.length > 5) {
      tag.delete();

      return res.status(200).send({
        message:
          "Tag has been deleted due to too many people voting for deletion",
      });
    }

    await tag.update(
      { $addToSet: { deletionVotes: ObjectId(req.userInSession.id) } },
      { timestamps: false }
    );

    return res.status(200).send({
      message:
        "Voted, tag will be deleted when enough people have voted for it's deletion",
    });
  })
  .all((req, res) => {
    res.status(405).send({ message: "Use another method" });
  });

module.exports = router;
