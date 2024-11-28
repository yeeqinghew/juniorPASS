const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const etagMiddleware = require("../middleware/etagMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");
const client = require("../utils/redisClient");
const { deleteS3Objects } = require("../utils/s3");

require("dotenv").config();
router.use(etagMiddleware);

// create listing
router.post("", authorization, async (req, res) => {
  try {
    const {
      partner_id,
      title,
      credit,
      package_types,
      description,
      age_groups,
      images,
      short_term_start_date,
      long_term_start_date,
      locations,
    } = req.body;

    const listing = await pool.query(
      `INSERT INTO listings (
        partner_id, 
        listing_title, 
        credit,
        package_types,      
        description,
        age_groups,
        rating, 
        images,
        short_term_start_date,
        long_term_start_date,
        active,
        created_on
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        partner_id,
        title,
        credit,
        package_types,
        description,
        age_groups,
        0,
        images,
        short_term_start_date,
        long_term_start_date,
        true,
        new Date().toLocaleString(),
      ]
    );

    const listing_id = listing.rows[0].listing_id;

    // insert outlets and schedules
    for (let location of locations) {
      const { address, nearest_mrt, schedules } = location;

      const outletResult = await pool.query(
        `INSERT INTO outlets (listing_id, address, nearest_mrt, created_on) 
        VALUES ($1, $2, $3, $4) RETURNING outlet_id`,
        [listing_id, address, nearest_mrt, new Date().toLocaleString()]
      );

      const outlet_id = outletResult.rows[0].outlet_id;

      for (schedule of schedules) {
        const { day, timeslot, frequency } = schedule;

        await pool.query(
          `INSERT INTO schedules (outlet_id, day, timeslot, frequency, created_on)
         VALUES($1, $2, $3, $4, $5)`,
          [outlet_id, day, timeslot, frequency, new Date().toLocaleString()]
        );
      }
    }

    // Optionally, invalidate or update related cache entries, like the list of all listings
    await client.del("/listings");

    res.status(201).json({
      message: "Listing has been created!",
      data: listing,
    });
  } catch (err) {
    console.error("ERROR in /listings POST", err.message);
    res.status(500).json({ error: err.message });
  }
});

// get all listings
router.get("", cacheMiddleware, async (req, res) => {
  try {
    const listings = await pool.query(
      "SELECT * FROM listings l JOIN partners p USING (partner_id) ORDER BY l.created_on DESC"
    );
    res.json(listings.rows);
  } catch (err) {
    console.error("ERROR in /listings GET", err.message);
    res.status(500).json({ error: err.message });
  }
});

// update listing
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const listingResult = await pool.query(
      `SELECT l.*, p.partner_name, p.email, p.website, p.contact_number 
      FROM listings l 
      JOIN partners p USING (partner_id) 
      WHERE l.listing_id = $1`,
      [id]
    );

    if (listingResult.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    let listing = listingResult.rows[0];

    listing.package_types = listing.package_types
      .replace(/[{}]/g, "")
      .split(",");
    listing.age_groups = listing.age_groups.replace(/[{}]/g, "").split(",");

    const ageGroups = await pool.query(`SELECT * FROM ageGroups`);
    const ageGroupMap = {};
    ageGroups.rows.forEach((ageGroup) => {
      ageGroupMap[ageGroup.name] = {
        min_age: ageGroup.min_age,
        max_age: ageGroup.max_age,
      };
    });

    // Map age_groups to their respective names and age ranges
    listing.age_groups = listing.age_groups.map((ageGroupName) => ({
      name: ageGroupName,
      ...ageGroupMap[ageGroupName],
    }));

    const outletsResult = await pool.query(
      `SELECT * FROM outlets WHERE listing_id = $1`,
      [id]
    );

    const outlets = outletsResult.rows;
    for (let outlet of outlets) {
      const schedulesResult = await pool.query(
        `SELECT * FROM schedules WHERE outlet_id = $1`,
        [outlet.outlet_id]
      );
      outlet.schedules = schedulesResult.rows;
    }

    listing.outlets = outlets;

    res.json(listing);
  } catch (err) {
    console.error(`ERROR in /listings/${id} GET`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// edit listing
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const {
      title_name,
      price,
      package_types,
      description,
      age_groups,
      images,
      locations,
    } = req.body;

    const listing = await pool.query(
      `UPDATE listings SET
        listing_title = $1,
        price = $2,
        package_types = $4,
        description = $5,
        age_groups = $6,
        images = $7,
        string_outlet_schedules = $8,
        last_updated_on = $9
       WHERE listing_id = $10`,
      [
        title_name,
        price,
        package_types,
        description,
        age_groups,
        images,
        locations,
        new Date().toLocaleString(),
        id,
      ]
    );

    // Invalidate the cache
    await client.del(`/listings/${id}`);
    res.status(200).json({
      message: "Listing has been updated!",
      data: listing,
    });
  } catch (err) {
    console.error(`ERROR in /listings/${id} PUT`, err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // retrieve image URLs from the DB
    const { rows } = await pool.query(
      `SELECT images FROM listings WHERE listing_id = $1`,
      [id]
    );

    // Extract image URLs from the database result
    const imageURLsString = rows[0].images;

    const imageURLs = imageURLsString
      .replace("{", "") // Remove leading '{'
      .replace("}", "") // Remove trailing '}'
      .split(","); // Split by comma to get individual URLs

    // Delete images from S3
    await deleteS3Objects(imageURLs);

    // delete listing from DB
    await pool.query(`DELETE FROM listings WHERE listing_id = $1`, [id]);

    // Invalidate the cache
    await client.del(`/listings/${id}`);

    // Optionally, invalidate or update related cache entries, like the list of all listings
    await client.del("/listings");

    res.status(200).json({
      message: "Listing has been deleted!",
    });
  } catch (err) {
    console.error(`ERROR in /listings/${id} DELETE`, err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
