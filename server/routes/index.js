const checkAuth = require("./../middleware/checkAuth");

const authRoutes = require("./Auth");
const postRoutes = require("./Post");
const tagRoutes = require("./Tag");
const userRoutes = require("./User");
const commentRoutes = require("./Comment");
const collectionRoutes = require("./Collection");

module.exports = function (app) {
  // auth middleware
  app.use(checkAuth);

  // routes
  app.use("/auth", authRoutes);
  app.use("/post", postRoutes);
  app.use("/tags", tagRoutes);
  app.use("/user", userRoutes);
  app.use("/comment", commentRoutes);
  app.use("/collection", collectionRoutes);

  // if 404
  app.use((req, res, next) => res.status(404).send({ message: "Not found" }));
};
