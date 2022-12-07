const router = require("express").Router();
const { ObjectId } = require("mongodb");

const { UserModel } = require("../models/User");
const { CollectionModel } = require("../models/Collection");

router.route("/:id").get(async (req, res) => {
  let userInfo = await UserModel.findOne({
    _id: ObjectId(req.params.id),
  })
    .select(
      "username profilePicture biography comments role following createdAt"
    )
    .populate("following", "_id username profilePicture")
    .lean();

  let collection = await CollectionModel.find({
    author: ObjectId(req.params.id),
  }).select("title");

  res.status(200).send({ ...userInfo, collection });
});

router
  .route("/")
  .patch(async (req, res) => {
    try {
      await UserModel.updateOne(
        { _id: ObjectId(req.userInSession.id) },
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
    await UserModel.deleteOne({ _id: ObjectId(req.userInSession.id) });

    res.status(200).send({ message: "Entry deleted" });
  })
  .all((req, res) => {
    res.status(405).send({ message: "Use another method" });
  });
module.exports = router;
