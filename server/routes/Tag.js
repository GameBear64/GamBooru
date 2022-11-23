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
      let tags = await TagModel.find({});
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

router.route("/:id").get(async (req, res) => {
  let tag = await TagModel.findOne({ _id: ObjectId(req.params.id) }).lean();

  if (tag.example.length == 0) {
    let example = await PostModel.find({ tags: tag._id })
      .select("_id")
      .limit(10)
      .populate("image", "thumbnail");

    return res.status(200).send({ ...tag, example });
  }

  res.status(200).send(tag);
});

module.exports = router;
