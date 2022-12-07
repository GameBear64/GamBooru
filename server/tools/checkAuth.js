const jwt = require("jsonwebtoken");
const { secret } = require("../../settings.json");

module.exports = (req, res, next) => {
  try {
    var decoded = jwt.verify(req.headers.jwt, secret);
    req.userInSession = { id: decoded.id, role: decoded.role };
  } catch (err) {
    // return res.status(401).send({ message: "Not Authorized" });
    req.userInSession = null;
  }
  next();
};
