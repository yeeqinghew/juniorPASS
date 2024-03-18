const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

// ADMIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await pool.query("SELECT * FROM admins WHERE username = $1", [
      username,
    ]);

    if (admin.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(
      password,
      admin.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    const token = jwtGenerator(admin.rows[0].admin_id);
    return res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
