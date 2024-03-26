const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/getAllAgeGroups", async (req, res) => {
  try {
    const ageGroups = await pool.query("SELECT * FROM ageGroups");
    res.json(ageGroups.rows);
  } catch (error) {
    console.error("ERROR in /misc/getAllAgeGroups", error.message);
  }
});

module.exports = router;
