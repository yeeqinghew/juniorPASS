const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// middleware
app.use(cors(corsOptions));
app.use(express.json());

// ROUTES
app.use("/auth", require("./routes/jwtAuth"));
app.use("/vendor", require("./routes/vendor"));
app.use("/admin", require("./routes/admin"));
app.use("/partner", require("./routes/partner"));
app.use("/listing", require("./routes/listing"));

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
