const express = require("express");
const app = express();
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", require("./routes/jwtAuth"));
app.use("/admin", require("./routes/admin"));
app.use("/partner", require("./routes/partner"));
app.use("/listing", require("./routes/listing"));
app.use("/misc", require("./routes/misc"));
app.use("/child", require("./routes/child"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
