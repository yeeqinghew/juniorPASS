const express = require("express");
const app = express();
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", require("./routes/jwtAuth"));
app.use("/admins", require("./routes/admins"));
app.use("/partners", require("./routes/partners"));
app.use("/listings", require("./routes/listings"));
app.use("/misc", require("./routes/misc"));
app.use("/children", require("./routes/children"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
