const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res) => {
  try {
    const jwtToken = req.header("token");
    if (!jwtToken) {
      return res.status(403).json("Not authorize");
    }

    const payload = jwt.verify(jwtToken, process.env.jwtSecret);
    req.user = payload.user;
  } catch (error) {
    console.error(error);
    return res.status(403).json("Not authorize");
  }
};
