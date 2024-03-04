const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    // get token and method from header
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(403).json("Not authorize");
    }

    const payload = jwt.verify(jwtToken, process.env.jwtSecret);
    req.user = payload.user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json("Not authorize");
  }
};
