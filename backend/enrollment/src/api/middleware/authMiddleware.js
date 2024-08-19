const jwt = require("jsonwebtoken");

const secretKey = "1234567890";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    
    const decoded = jwt.verify(token, secretKey);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Authentication Failed" });
  }
};

module.exports = authMiddleware;
