const router = require("express").Router();
const { ObjectId } = require("mongodb");

const { FlagModel } = require("../models/Flag");

router
  .route("/")
  .get(async (req, res) => {
    try {
      let flags = await FlagModel.find({})
        .populate("author", "username")
        .populate("resolved", "username");

      res.status(200).send(flags);
    } catch (err) {
      console.log(err);
      return res
        .status(406)
        .send({ message: "Error while fetching flagged", error: err });
    }
  })
  .all((req, res) => {
    res.status(405).send({ message: "Use another method" });
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      let flags = await FlagModel.find({
        parent: ObjectId(req.params.id),
      }).populate("author", "username");

      res.status(200).send(flags);
    } catch (err) {
      console.log(err);
      return res
        .status(406)
        .send({ message: "Error while fetching flagged", error: err });
    }
  })
  .all((req, res) => {
    res.status(405).send({ message: "Use another method" });
  });

router
  .route("/of/:id")
  .get(async (req, res) => {
    try {
      let flags = await FlagModel.find({ parent: ObjectId(req.params.id) });

      res.status(200).send(flags);
    } catch (err) {
      console.log(err);
      return res
        .status(406)
        .send({ message: "Error while fetching flagged", error: err });
    }
  })
  .all((req, res) => {
    res.status(405).send({ message: "Use another method" });
  });

router.route("/resolve/:id").post(async (req, res) => {
  if (!req.userInSession)
    return res.status(401).send({ message: "Not Authorized" });

  try {
    await FlagModel.updateOne(
      { _id: ObjectId(req.params.id) },
      { resolved: ObjectId(req.userInSession.id) }
    );

    return res.status(200).send({ message: "Entry patched" });
  } catch (err) {
    console.log(err);
    return res
      .status(406)
      .send({ message: "Error while fetching flagged", error: err });
  }
});

module.exports = router;
