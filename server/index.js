const express = require("express");
const app = express();
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", require("./routes/jwtAuth"));
app.use("/vendor", require("./routes/vendor"));
app.use("/admin", require("./routes/admin"));
app.use("/partner", require("./routes/partner"));
app.use("/listing", require("./routes/listing"));
app.use("/misc", require("./routes/misc"));

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
