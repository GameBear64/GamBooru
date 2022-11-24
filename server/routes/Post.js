const router = require("express").Router();
const { ObjectId } = require("mongodb");
const md5 = require("md5");
const sharp = require("sharp");

const checkAuth = require("./../middleware/checkAuth");

const { PostModel } = require("../models/Post");
const { ImageModel } = require("../models/Image");
// const { CommentModel } = require("../models/Comment");

router.route("/count").get(async (req, res) => {
  let count = await PostModel.count({});

  res.status(200).send({ count });
});

router.route("/page/:page").get(async (req, res) => {
  try {
    // prettier-ignore
    let posts = await PostModel
    .find({})
    .sort({ createdAt: -1 })
    .skip((req.params.page - 1 ) * 20)
    .limit(20)
    .populate('image', "thumbnail")
    .populate('tags', "name category count")

    res.status(200).send(posts);
  } catch (err) {
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
      // let linkTags = req.body.tags.map((tag) => ObjectId(tag));

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
    await PostModel.updateOne(
      { _id: ObjectId(req.params.id) },
      { $inc: { views: 1 } },
      { timestamps: false }
    );

    let post = await PostModel.findOne({ _id: ObjectId(req.params.id) })
      .populate("image")
      .populate("tags", "name category count")
      .populate("author", "username");

    // .populate({
    //   path: "comments",
    //   populate: {
    //     path: "author",
    //     select: ["nickname", "firstName", "lastName", "profilePicture"],
    //   },
    //   options: {
    //     project: {
    //       score: { $subtract: ["$upVotes", "$downVotes"] },
    //     },
    //     sort: { score: -1, createdAt: -1 },
    //   },
    // })

    res.status(200).send(post);
  })
  .patch(async (req, res) => {
    if (!req.userInSession)
      return res.status(401).send({ message: "Not Authorized" });

    try {
      await PostModel.updateOne(
        { _id: ObjectId(req.params.id) },
        { ...req.body }
      );

      return res.status(200).send({ message: "Entry patched" });
    } catch (err) {
      return res
        .status(406)
        .send({ message: "Error while editing post", error: err });
    }
  });
//   .delete(async (req, res) => {
//     let post = await PostModel.findOne({ _id: ObjectId(req.params.id) });

//     if (req.userInSession.id !== post.author.toString())
//       return res.status(401).send({ message: "Not Authorized" });

//     await post.delete();
//     await CommentModel.deleteMany({ _id: { $in: post.comments } });

//     await res.status(200).send({ message: "Entry deleted" });
//   })
//   .all((req, res) => {
//     res.status(405).send({ message: "Use another method" });
//   });

// router
//   .route("/like/:id")
//   .patch(async (req, res) => {
//     let post = await PostModel.findOne({ _id: ObjectId(req.params.id) });

//     if (post.likeMode === likeMode.Cheer) {
//       await post.update(
//         { $push: { likes: req.userInSession.id } },
//         { timestamps: false }
//       );
//     } else {
//       if (post.likes.includes(req.userInSession.id)) {
//         await post.update(
//           { $pull: { likes: req.userInSession.id } },
//           { timestamps: false }
//         );
//       } else {
//         await post.update(
//           { $push: { likes: req.userInSession.id } },
//           { timestamps: false }
//         );
//       }
//     }

//     // get most relevant info
//     post = await PostModel.findOne({ _id: ObjectId(req.params.id) });

//     res.status(200).send({ message: "Entry patched", likes: post.likes });
//   })
//   .all((req, res) => {
//     res.status(405).send({ message: "Use another method" });
//   });

// router.route("/byuser/:authorId/:page").get(async (req, res) => {
//   let count = await PostModel.count({ author: req.params.authorId });

//   // prettier-ignore
//   let posts = await PostModel
//     .find({author: req.params.authorId})
//     .sort({ createdAt: -1 })
//     .skip(req.params.page * 10)
//     .limit(10)
//     .populate('images')
//     .populate('author', 'nickname firstName lastName profilePicture');

//   res.status(200).send({ posts, count });
// });

async function uploadImage(image, req) {
  let foundImage = await ImageModel.findOne({ md5: md5(image) });

  if (image.length > 1100000) return { message: "Image too big" };
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
