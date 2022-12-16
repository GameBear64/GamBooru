const router = require("express").Router();
const { ObjectId } = require("mongodb");
const rateLimited = new Set();

const { CollectionModel } = require("../models/Collection");
const { PostModel } = require("../models/Post");

router.route("/list/:id").get(async (req, res) => {
  try {
    let collection = await CollectionModel.find({
      author: ObjectId(req.params.id),
    }).select("title posts");

    res.status(200).send(collection);
  } catch (err) {
    console.log(err);
    return res
      .status(406)
      .send({ message: "Error while fetching posts", error: err });
  }
});

router.route("/likes").get(async (req, res) => {
  try {
    let collection = await PostModel.find({
      likes: ObjectId(req?.userInSession?.id),
    })
      .populate("image", "thumbnail")
      .populate("tags", "name category count");

    res.status(200).send(collection);
  } catch (err) {
    console.log(err);
    return res
      .status(406)
      .send({ message: "Error while fetching posts", error: err });
  }
});

router.route("/posts").get(async (req, res) => {
  try {
    let collection = await PostModel.find({
      author: ObjectId(req?.userInSession?.id),
    })
      .populate("image", "thumbnail")
      .populate("tags", "name category count");

    res.status(200).send(collection);
  } catch (err) {
    console.log(err);
    return res
      .status(406)
      .send({ message: "Error while fetching posts", error: err });
  }
});

router.route("/add").post(async (req, res) => {
  let allCollections = await CollectionModel.find({
    author: ObjectId(req?.userInSession?.id),
  }).select("_id");

  allCollections.forEach(async (aCol) => {
    if (req.body.collections.includes(aCol._id.toString())) {
      await CollectionModel.updateOne(
        { _id: ObjectId(aCol._id) },
        { $addToSet: { posts: ObjectId(req.body.post) } }
      );
    } else {
      await CollectionModel.updateOne(
        { _id: ObjectId(aCol._id) },
        { $pull: { posts: ObjectId(req.body.post) } }
      );
    }
  });
});

router
  .route("/:id")
  .get(async (req, res) => {
    // ======== rate limit for views ==============
    let viewIdString = `${req?.userInSession?.id}/${req.params.id}`;
    if (req?.userInSession?.id && !rateLimited.has(viewIdString)) {
      await CollectionModel.updateOne(
        { _id: ObjectId(req.params.id) },
        { $inc: { views: 1 } },
        { timestamps: false }
      );

      // ===== rate limit timer =======
      rateLimited.add(viewIdString);
      setTimeout(() => {
        rateLimited.delete(viewIdString);
      }, 10 * 60 * 1000); //==== 10 minutes ====
    }

    try {
      let collection = await CollectionModel.findOne({
        _id: ObjectId(req.params.id),
      }).populate({
        path: "posts",
        select: ["image", "tags", "createdAt"],
        populate: [
          {
            path: "image",
            select: ["thumbnail"],
          },
          {
            path: "tags",
            select: ["name", "category", "count"],
          },
        ],
      });

      res.status(200).send(collection);
    } catch (err) {
      console.log(err);
      return res
        .status(406)
        .send({ message: "Error while fetching posts", error: err });
    }
  })
  .patch(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    try {
      await CollectionModel.updateOne(
        { _id: ObjectId(req.params.id) },
        { ...req.body }
      );

      return res.status(200).send({ message: "Entry patched" });
    } catch (err) {
      return res
        .status(406)
        .send({ message: "Error while editing post", error: err });
    }
  })
  .delete(async (req, res) => {
    let post = await CollectionModel.findOne({ _id: ObjectId(req.params.id) });

    if (req.userInSession.id !== post.author.toString())
      return res.status(401).send({ message: "Not Authorized" });

    await CollectionModel.deleteOne({ _id: ObjectId(req.params.id) });

    res.status(200).send({ message: "Entry deleted" });
  })
  .all((req, res) => {
    res.status(405).send({ message: "Use another method" });
  });

router
  .route("/")
  .post(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    try {
      await CollectionModel.create({
        ...req.body,
        author: req.userInSession.id,
      });
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

module.exports = router;
