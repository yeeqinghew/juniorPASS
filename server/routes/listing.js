const express = require("express");
const router = express.Router();
const pool = require("../db");

// create listing
router.post("/createListing", async (req, res) => {
  try {
    const {
      title,
      price,
      category,
      description,
      address,
      region,
      age_group,
      file,
      partner_id,
    } = req.body;
    const listing = await pool.query(
      "INSERT INTO listings(partner_id, listing_title, price, category, description, address, latitude, longitude, region, age_group, rating, pictures, created_on) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
      [
        partner_id,
        title,
        price,
        category,
        description,
        address,
        address["LATITUDE"],
        address["LONGITUDE"],
        region,
        age_group,
        0,
        file,
        new Date().toLocaleString(),
      ]
    );
    // const listing = await pool.query(
    //   "INSERT INTO listings(listing_title, price, category, description, picture, address, latitude, longitude, region, age_group, pictures, created_on) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
    //   [
    //     listing_title,
    //     price,
    //     category,
    //     description,
    //     picture,
    //     address,
    //     latitude,
    //     longitude,
    //     region,
    //     age_group,
    //     pictures,
    //     new Date().toLocaleString(),
    //   ]
    // );
    res.json(listing.rows[0]);
  } catch (err) {
    console.error("ERROR in /listing/createListing", err.message);
  }
});

// get all listings
router.get("/getAllListings", async (req, res) => {
  try {
    const listings = await pool.query("SELECT * FROM listings");
    res.json(listings.rows);
  } catch (err) {
    console.error("ERROR in /listing/getAllListings", err.message);
  }
});

module.exports = router;
