const express = require("express");
const app = express();
const pool = require("./db");

const port = 5000;
// create a user
app.post("/user", async (req, res) => {
  // await the function
  try {
    const data = req.body;
    const newUser = await pool.query(
      "INSERT INTO users(user_type, email, password, created_at, phone_number, method) VALUES($1)",
      []
    );
    console.log(req.body);
  } catch (err) {
    console.error(err.message);
  }
});
// get all users
