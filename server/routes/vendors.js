const express = require("express");
const router = express.Router();
const pool = require("../db");

// get all vendors
router.get("/getAllVendors", async (req, res) => {
  try {
    const vendors = await pool.query("SELECT * FROM vendors");
    res.json(vendors.rows);
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
