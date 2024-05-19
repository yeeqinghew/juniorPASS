const crypto = require("crypto");

const generateETag = (data) => {
  return crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");
};

module.exports = generateETag;
