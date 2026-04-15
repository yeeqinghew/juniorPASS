const redis = require("ioredis");
const client = process.env.REDIS_URL
  ? new redis(process.env.REDIS_URL)
  : redis.createClient({
      host: "127.0.0.1",
      port: 6379,
    });

client.on("error", (err) => {
  console.error("Redis error:", err);
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

module.exports = client;
