const checkAuth = require("./../middleware/checkAuth");

const authRoutes = require("./Auth");
const postRoutes = require("./Post");
const tagRoutes = require("./Tag");

module.exports = function (app) {
  // // auth middleware
  app.use(checkAuth);

  app.use("/auth", authRoutes);
  app.use("/post", postRoutes);
  app.use("/tags", tagRoutes);

  //if 404
  app.use((req, res, next) => res.status(404).send({ message: "Not found" }));
};
