const generateETag = require("../utils/etag");

const etagMiddleware = (req, res, next) => {
  // Override res.json to add ETag handling
  const originalJson = res.json;

  res.json = (data) => {
    const eTag = generateETag(data);
    res.set("ETag", eTag);

    if (req.headers["if-none-match"] === eTag) {
      return res.status(304).end(); // api request MUST NOT be performed
    }

    originalJson.call(res, data);
  };

  next();
};

module.exports = etagMiddleware;
