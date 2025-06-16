const express = require("express");
const path = require("path"); // Import path module
const app = express();
const cors = require("cors");
const client = require("./utils/redisClient"); // Import the Redis client

// middleware
app.use(cors());
app.use(express.json());

// Cache-Control middleware - to instruct browsers and intermediate cache (CDNs) on how cache the response
app.use((req, res, next) => {
  res.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

// ROUTES
app.use("/auth", require("./routes/jwtAuth"));
app.use("/admins", require("./routes/admins"));
app.use("/partners", require("./routes/partners"));
app.use("/listings", require("./routes/listings"));
app.use("/misc", require("./routes/misc"));
app.use("/children", require("./routes/children"));
app.use("/notifications", require("./routes/notifications"));

// Catch-all route to serve React app for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});

// Properly handle shutdown
const shutdown = () => {
  server.close(() => {
    console.log("HTTP server closed.");
    client.quit(() => {
      console.log("Redis client closed.");
      process.exit(0);
    });
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
