const router = require("express").Router();
const { ObjectId } = require("mongodb");
const md5 = require("md5");
const sharp = require("sharp");
const rateLimited = new Set();

const { Flaggable } = require("../enums.js");

const { PostModel } = require("../models/Post");
const { ImageModel } = require("../models/Image");
const { FlagModel } = require("../models/Flag");

const pageSize = 20;

router.route("/count").get(async (req, res) => {
  let count = await PostModel.count({});

  res.status(200).send({ count, pages: Math.ceil(count / pageSize) });
});

router.route("/page/:page").get(async (req, res) => {
  let query = req.query?.tags
    ? {
        $and: req.query?.tags?.split(",").map((tagId) => ({
          $in: [ObjectId(tagId), "$tags"],
        })),
      }
    : true;

  // next time do it with $all

  let sort = {
    byDate: { createdAt: -1 },
    byScore: { likesCount: -1 },
    byViews: { views: -1 },
  }[req.query?.order || "byDate"];

  try {
    let posts = await PostModel.aggregate([
      {
        $addFields: {
          searchFlag: query,
        },
      },
      {
        $match: { searchFlag: true },
      },
      {
        $lookup: {
          from: "images",
          localField: "image",
          foreignField: "_id",
          as: "image",
        },
      },
      { $unwind: { path: "$image", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $addFields: { likesCount: { $size: { $ifNull: ["$likes", []] } } },
      },
      {
        $sort: sort,
      },
      {
        $project: {
          searchFlag: 0,
          likesCount: 0,
          "image.data": 0,
          "image.author": 0,
          "image.md5": 0,
          "tags.description": 0,
          "tags.example": 0,
          "tags.history": 0,
          "tags.comments": 0,
        },
      },
    ])
      .skip((req.params.page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    return res
      .status(406)
      .send({ message: "Error while fetching posts", error: err });
  }
});

router
  .route("/")
  .post(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    try {
      let imageIds = await uploadImage(req.body.fileSource, req);

      await PostModel.create({
        ...req.body,
        author: req.userInSession.id,
        image: imageIds,
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

router
  .route("/:id")
  .get(async (req, res) => {
    // ======== rate limit for views ==============
    try {
      let viewIdString = `${req?.userInSession?.id}/${req.params.id}`;
      if (req?.userInSession?.id && !rateLimited.has(viewIdString)) {
        await PostModel.updateOne(
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

      let post = await PostModel.findOne({ _id: ObjectId(req.params.id) })
        .populate("image")
        .populate("tags", "name category count")
        .populate("author", "username")
        .populate({
          path: "comments",
          populate: {
            path: "author",
            select: ["username", "profilePicture"],
          },
          options: {
            sort: { likes: -1, createdAt: -1 },
          },
        });

      if (post == null) return res.status(404).send({ message: "Not found" });

      res.status(200).send(post);
    } catch (err) {
      return res
        .status(406)
        .send({ message: "Error while editing post", error: err });
    }
  })
  .patch(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    try {
      await PostModel.updateOne(
        { _id: ObjectId(req.params.id) },
        { ...req.body, $set: { deletionVotes: [] } }
      );

      return res.status(200).send({ message: "Entry patched" });
    } catch (err) {
      return res
        .status(406)
        .send({ message: "Error while editing post", error: err });
    }
  })
  .delete(async (req, res) => {
    let post = await PostModel.findOne({ _id: ObjectId(req.params.id) });

    if (req.userInSession.id !== post.author.toString())
      return res.status(401).send({ message: "Not Authorized" });

    await PostModel.deleteOne({ _id: ObjectId(req.params.id) });

    res.status(200).send({ message: "Entry deleted" });
  })
  .all((req, res) => {
    res.status(405).send({ message: "Use another method" });
  });

router
  .route("/like/:id")
  .post(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    let post = await PostModel.findOne({ _id: ObjectId(req.params.id) });

    if (post.likes.includes(req.userInSession.id)) {
      await post.update(
        { $pull: { likes: req.userInSession.id } },
        { timestamps: false }
      );
      res.status(200).send({ message: "Removed like" });
    } else {
      await post.update(
        { $push: { likes: req.userInSession.id } },
        { timestamps: false }
      );
      res.status(200).send({ message: "Liked" });
    }
  })
  .all((req, res) => {
    res.status(405).send({ message: "Use another method" });
  });

router
  .route("/voteDelete/:id")
  .post(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    let post = await PostModel.findOne({ _id: ObjectId(req.params.id) });

    if (post.deletionVotes.length > 5) {
      post.delete();

      return res.status(200).send({
        message:
          "Post has been deleted due to too many people voting for deletion",
      });
    }

    await post.update(
      { $addToSet: { deletionVotes: ObjectId(req.userInSession.id) } },
      { timestamps: false }
    );

    return res.status(200).send({
      message:
        "Voted, post will be deleted when enough people have voted for it's deletion",
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
      type: Flaggable.Post,
      parent: ObjectId(req.params.id),
    });

    await PostModel.updateOne(
      { _id: ObjectId(req.params.id) },
      { $push: { flag: newFlag } },
      { timestamps: false }
    );
    res.status(200).send({ message: "Flagged" });
  })
  .all((req, res) => {
    res.status(405).send({ message: "This route is POST only" });
  });

async function uploadImage(image, req) {
  let foundImage = await ImageModel.findOne({ md5: md5(image) });

  if (image.length > 8388608 /*8MB*/) return { message: "Image too big" };
  if (foundImage) return { message: "Image exists" };

  const buffer = Buffer.from(image.split(";base64,").pop(), "base64");

  return sharp(buffer)
    .resize(150, 150, { fit: "inside" })
    .toBuffer()
    .then((thumbnail) => {
      return ImageModel.create({
        data: image,
        thumbnail: `data:image/jpeg;base64,${thumbnail.toString("base64")}`,
        md5: md5(image),
        author: req.userInSession.id,
      });
    });
}
module.exports = router;
