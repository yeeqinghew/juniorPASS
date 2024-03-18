const express = require("express");
const app = express();
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", require("./routes/jwtAuth"));
app.use("/vendors", require("./routes/vendors"));
app.use("/admin", require("./routes/admin"));

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
