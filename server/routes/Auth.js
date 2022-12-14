const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { ObjectId } = require("mongodb");

const { UserModel } = require("../models/User");

const settings = require("./../../settings.json");

const createJWTSendCookie = (user) => {
  let expireAt = 3 * 30 * 24 * 60 * 60; /*3 months*/
  return jwt.sign({ id: user.id, role: user.role }, settings.secret, {
    expiresIn: expireAt,
  });
};

const filterUserFelids = ({ _id, userName }) => ({
  _id,
  userName,
});

router
  .route("/login")
  .post(async (req, res) => {
    let userAttempting = await UserModel.findOne({ email: req.body.email });
    if (!userAttempting)
      return res.status(403).send({ message: "User does not exists" });

    bcrypt.compare(
      req.body?.password,
      userAttempting.password,
      function (err, result) {
        if (result) {
          return res.status(200).send({
            jwt: createJWTSendCookie(userAttempting),
            user: filterUserFelids(userAttempting),
          });
        } else {
          return res.status(401).send({ message: "Wrong credentials" });
        }
      }
    );
  })
  .all((req, res) => {
    res.status(405).send({ message: "Route is POST only" });
  });

router
  .route("/register")
  .post(async (req, res) => {
    let userExists = await UserModel.findOne({ email: req.body.email });
    if (userExists) return res.status(403).send({ message: "User exists" });

    if (
      req.body?.password?.length < 8 ||
      req.body?.confirmPassword !== req.body?.password
    )
      return res.status(406).send({ message: "Invalid password" });

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body?.password, salt, async function (err, hash) {
        req.body.password = hash;
        req.body.profilePicture = `https://ui-avatars.com/api/?size=255&bold=true&background=random&name=${encodeURIComponent(
          `${req.body.username}`
        )}`;

        try {
          let user = await UserModel.create(req.body);
          return res.status(201).send({
            jwt: createJWTSendCookie(user),
            user: filterUserFelids(user),
          });
        } catch (err) {
          return res
            .status(406)
            .send({ message: "Error while creating user", error: err });
        }
      });
    });
  })
  .all((req, res) => {
    res.status(405).send({ message: "Route is POST only" });
  });

router
  .route("/resetPassword")
  .patch(async (req, res) => {
    let userProfile = await UserModel.findOne({
      _id: ObjectId(req.userInSession.id),
    });

    //confirm old password first
    bcrypt.compare(req.body?.oldPassword, userProfile.password).then((rez) => {
      if (!rez) return res.status(401).send({ message: "Wrong credentials" });

      if (
        req.body?.password?.length < 8 ||
        req.body?.confirmPassword !== req.body?.password
      )
        return res.status(406).send({ message: "Invalid new password" });

      if (req.body?.password !== req.body?.confirmPassword)
        return res.status(403).send({ message: "Passwords don't match" });

      //change pass
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body?.password, salt, async function (err, hash) {
          try {
            await userProfile.update({ password: hash });

            return res.status(201).send({ message: "User Updated" });
          } catch (err) {
            return res
              .status(406)
              .send({ message: "Error while changing password", error: err });
          }
        });
      });
    });
  })
  .all((req, res) => {
    res.status(405).send({ message: "Route is PATCH only" });
  });

module.exports = router;
