const express = require("express");
const router = express.Router();
const pool = require("../db");

// create a user
router.post("/user", async (req, res) => {
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
router.get("/", async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users");
    res.json(user.rows);
  } catch (error) {
    console.error(err.message);
    res.status(500);
  }
});
module.exports = router;
