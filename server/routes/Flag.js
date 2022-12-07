const router = require("express").Router();

const { FlagModel } = require("../models/Flag");

router
  .route("/")
  .get(async (req, res) => {
    try {
      let flags = await FlagModel.find({});

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

router.route("/resolve/:id").patch(async (req, res) => {
  try {
    await FlagModel.updateOne(
      { _id: ObjectId(req.params.id) },
      { resolved: true }
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
