const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

// PARTNER
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const partner = await pool.query(
      "SELECT * FROM partners WHERE email = $1",
      [email]
    );

    if (partner.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(
      password,
      partner.rows[0].password
    );
    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    const token = jwtGenerator(partner.rows[0].partner_id);
    return res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
