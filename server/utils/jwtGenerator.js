const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id) {
  const payload = {
    user: user_id,
  };

  return jwt.sign(payload, process.env.jwtSecret, {
    expiresIn: "2h",
    // expiresIn: "2000",
  });
}

module.exports = jwtGenerator;
