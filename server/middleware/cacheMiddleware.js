const client = require("../utils/redisClient");

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  client.get(key, (err, data) => {
    if (err) {
      console.error("Redis GET error:", err);
      return next();
    }

    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        client.setex(key, 3600, JSON.stringify(body), (err) => {
          if (err) console.error("Redis SETEX error:", err);
        }); // Cache for 1 hour
        res.sendResponse(body);
      };
      next();
    }
  });
};

module.exports = cacheMiddleware;
