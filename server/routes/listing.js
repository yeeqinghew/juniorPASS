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
      "SELECT * FROM listing l JOIN partner p USING (partner_id) ORDER BY l.created_on ASC"
    );
    res.json(listings.rows);
  } catch (err) {
    console.error("ERROR in /listing/getAllListings", err.message);
    res.status(500).json({ error: err.message });
  }
});

// update listing
router.get("/editListing/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const listing = await pool.query(
      "SELECT * FROM listing WHERE listing_id = $1",
      [id]
    );
    res.json(listing.rows[0]);
  } catch (err) {
    console.error(`ERROR in /listing/editListing/${id}`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// edit listing
router.put("/updateListing/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const {
      title_name,
      price,
      categories,
      package_types,
      description,
      age_groups,
      image,
      string_outlet_schedules,
    } = req.body;
    console.log("title", title_name);
    const listing = await pool.query(
      `UPDATE listing SET
        listing_title = $1,
        price = $2,
        categories = $3,
        package_types = $4,
        description = $5,
        age_groups = $6,
        image = $7,
        string_outlet_schedules = $8,
        last_updated_on = $9
       WHERE listing_id = $10`,
      [
        title_name,
        price,
        categories,
        package_types,
        description,
        age_groups,
        image,
        string_outlet_schedules,
        new Date().toLocaleString(),
        id,
      ]
    );
    res.status(200).json({
      message: "Listing has been updated!",
    });
  } catch (err) {
    console.error(`ERROR in /listing/updateListing/${id}`, err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
