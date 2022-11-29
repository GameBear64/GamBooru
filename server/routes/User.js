const router = require("express").Router();
const { ObjectId } = require("mongodb");

const checkAuth = require("../middleware/checkAuth");

const { UserModel } = require("../models/User");

router.route("/:id").get(async (req, res) => {
  let userInfo = await UserModel.findOne({
    _id: ObjectId(req.params.id),
  })
    .select("username profilePicture biography comments role following")
    .populate("following", "_id username profilePicture");

  res.status(200).send(userInfo);
});
// .patch(async (req, res) => {
//   if (!req.userInSession)
//     return res.status(401).send({ message: "Not Authorized" });

//   try {
//     await PostModel.updateOne(
//       { _id: ObjectId(req.params.id) },
//       { ...req.body }
//     );

//     return res.status(200).send({ message: "Entry patched" });
//   } catch (err) {
//     return res
//       .status(406)
//       .send({ message: "Error while editing post", error: err });
//   }
// });
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
module.exports = router;
