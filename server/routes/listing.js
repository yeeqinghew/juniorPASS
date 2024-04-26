const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
require("dotenv").config();

// create listing
router.post("/createListing", authorization, async (req, res) => {
  try {
    const {
      partner_id,
      title,
      credit,
      categories,
      package_types,
      description,
      age_groups,
      image,
      string_outlet_schedules,
    } = req.body;

    const listing = await pool.query(
      `INSERT INTO listing(
        partner_id, 
        listing_title, 
        credit,
        categories,
        package_types,      
        description,
        age_groups,
        rating, 
        image,
        string_outlet_schedules,
        created_on
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        partner_id,
        title,
        credit,
        categories,
        package_types,
        description,
        age_groups,
        0,
        image,
        string_outlet_schedules,
        new Date().toLocaleString(),
      ]
    );
    res.status(201).json({
      message: "Listing has been created!",
      data: listing,
    });
  } catch (err) {
    console.error("ERROR in /listing/createListing", err.message);
    res.status(500).json({ error: err.message });
  }
});

// get all listings
router.get("/getAllListings", async (req, res) => {
  try {
    const listings = await pool.query(
      "SELECT * FROM listing ORDER BY created_on ASC"
    );
    res.json(listings.rows);
  } catch (err) {
    console.error("ERROR in /listing/getAllListings", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
