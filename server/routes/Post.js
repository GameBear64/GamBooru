const router = require("express").Router();
const ObjectId = require("mongodb").ObjectId;
const md5 = require("md5");
const sharp = require("sharp");

const checkAuth = require("./../middleware/checkAuth");

const { UserModel } = require("../models/User");
const { PostModel } = require("../models/Post");
const { ImageModel } = require("../models/Image");
// const { CommentModel } = require("../models/Comment");

// const filterEditedResponse = ({ status, body, images }) => {
//   let newImages = images.filter((img) => !img.author);
//   images = images.filter((img) => img.author).map((img) => img._id);

//   return { status, body, images, newImages };
// };

router.route("/page/:page").get(async (req, res) => {
  // prettier-ignore
  try {
    let posts = await PostModel
    .find({})
    .sort({ createdAt: -1 })
    .skip((req.params.page - 1 ) * 20)
    .limit(20)
    .populate('images', "thumbnail")
    res.status(200).send({ posts });
  } catch (err) {
    return res
        .status(406)
        .send({ message: "Error while fetching posts", error: err });
  }
});

router
  .route("/")
  .all(checkAuth)
  .post(async (req, res) => {
    try {
      let imageIds = await uploadImage(req.body.fileSource, req);

      await PostModel.create({
        ...req.body,
        author: req.userInSession,
        images: imageIds,
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

// router
//   .route("/:id")
//   .get(async (req, res) => {
//     // let commentsFiltering = await CommentModel.aggregate([
//     //   {
//     //     $project: {
//     //       score: { $subtract: ['$upVotes', '$downVotes'] },
//     //     },
//     //   },
//     //   {
//     //     $sort: { score: -1 },
//     //   },
//     // ]);

//     // console.log(commentsFiltering);

//     let post = await PostModel.findOne({ _id: ObjectId(req.params.id) })
//       .populate("images")
//       .populate({
//         path: "comments",
//         populate: {
//           path: "author",
//           select: ["nickname", "firstName", "lastName", "profilePicture"],
//         },
//         options: {
//           project: {
//             score: { $subtract: ["$upVotes", "$downVotes"] },
//           },
//           sort: { score: -1, createdAt: -1 },
//         },
//       })
//       .populate("author", "nickname firstName lastName profilePicture");

//     res.status(200).send(post);
//   })
//   .patch(async (req, res) => {
//     if (req.body?.body?.length > 2000 || req.body?.status?.length > 30)
//       return res.status(406).send({ message: "Felid too long" });

//     let post = await PostModel.findOne({ _id: ObjectId(req.params.id) });

//     if (req.userInSession !== post.author.toString())
//       return res.status(401).send({ message: "Not Authorized" });

//     try {
//       let response = filterEditedResponse(req.body);
//       let imageIds = await uploadImages(response.newImages, req);
//       delete response.newImages;

//       response.images = response.images.concat(imageIds);
//       await post.update(response);

//       return res.status(200).send({ message: "Entry patched" });
//     } catch (err) {
//       return res
//         .status(406)
//         .send({ message: "Error while editing post", error: err });
//     }
//   })
//   .delete(async (req, res) => {
//     let post = await PostModel.findOne({ _id: ObjectId(req.params.id) });

//     if (req.userInSession !== post.author.toString())
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
//         { $push: { likes: req.userInSession } },
//         { timestamps: false }
//       );
//     } else {
//       if (post.likes.includes(req.userInSession)) {
//         await post.update(
//           { $pull: { likes: req.userInSession } },
//           { timestamps: false }
//         );
//       } else {
//         await post.update(
//           { $push: { likes: req.userInSession } },
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
    .resize(150, 150)
    .toBuffer()
    .then((thumbnail) => {
      return ImageModel.create({
        data: image,
        thumbnail: `data:image/jpeg;base64,${thumbnail.toString("base64")}`,
        md5: md5(image),
        author: req.userInSession,
      });
    });
}
module.exports = router;
