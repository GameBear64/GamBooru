const checkAuth = require("./../middleware/checkAuth");

const authRoutes = require("./Auth");
// const userRoutes = require('./User');
const postRoutes = require("./Post");
// const searchRoutes = require('./Search');
// const commentRoutes = require('./Comment');

module.exports = function (app) {
  // no-auth routes
  app.use("/auth", authRoutes);

  // auth middleware
  // app.use(checkAuth);

  // // routes
  // app.use('/user', userRoutes);
  app.use("/post", postRoutes);
  // app.use('/search', searchRoutes);
  // app.use('/comment', commentRoutes);

  //if 404
  app.use((req, res, next) => res.status(404).send({ message: "Not found" }));
};
