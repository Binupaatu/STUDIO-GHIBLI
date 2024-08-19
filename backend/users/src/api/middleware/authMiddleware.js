const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../../config");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, APP_SECRET);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Authentication Failed" });
  }
};

module.exports = authMiddleware;
