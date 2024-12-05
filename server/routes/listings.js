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
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
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
      ]
    );

    const listing_id = listing.rows[0].listing_id;

    // insert outlets and schedules
    for (let location of locations) {
      const { address, nearest_mrt, schedules } = location;

      const outletResult = await pool.query(
        `INSERT INTO outlets (listing_id, address, nearest_mrt) 
        VALUES ($1, $2, $3, $4) RETURNING outlet_id`,
        [listing_id, address, nearest_mrt]
      );

      const outlet_id = outletResult.rows[0].outlet_id;

      for (schedule of schedules) {
        const { day, timeslot, frequency } = schedule;

        await pool.query(
          `INSERT INTO schedules (outlet_id, day, timeslot, frequency)
         VALUES($1, $2, $3, $4, $5)`,
          [outlet_id, day, timeslot, frequency]
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
      `SELECT 
        l.listing_id,
        l.listing_title,
        l.description AS listing_description,
        l.price,
        l.credit,
        array_to_json(l.package_types) AS package_types,
        array_to_json(l.age_groups) AS age_groups,
        l.images,
        l.rating AS listing_rating,
        l.created_on AS listing_created_on,
        l.active,
        json_build_object(
          'partner_id', p.partner_id,
          'partner_name', p.partner_name,
          'email', p.email,
          'categories', p.categories,
          'contact_number', p.contact_number,
          'rating', p.rating,
          'picture', p.picture,
          'website', p.website
        ) AS partner_info,
        COALESCE(
            json_agg(
                json_build_object(
                    'outlet_id', o.outlet_id,
                    'address', o.address,
                    'nearest_mrt', o.nearest_mrt,
                    'created_on', o.created_on,
                    'schedules', os.schedules
                )
            ) FILTER (WHERE o.outlet_id IS NOT NULL),
            '[]'::json
        ) AS outlets
      FROM listings l
      LEFT JOIN partners p ON p.partner_id = l.partner_id
      LEFT JOIN outlets o ON o.listing_id = l.listing_id
      LEFT JOIN LATERAL (
          SELECT 
              json_agg(
                  json_build_object(
                      'schedule_id', s.schedule_id,
                      'day', s.day,
                      'timeslot', s.timeslot,
                      'frequency', s.frequency,
                      'created_on', s.created_on
                  )
              ) AS schedules
          FROM schedules s
          WHERE s.outlet_id = o.outlet_id
      ) os ON true
      GROUP BY 
          l.listing_id, p.partner_id
      ORDER BY 
          l.created_on DESC;`
    );
    return res.status(200).json(listings.rows);
  } catch (err) {
    console.error("ERROR in /listings GET", err.message);
    res.status(500).json({ error: err.message });
  }
});

// get listing by listing_id
router.get("/:id", cacheMiddleware, async (req, res) => {
  const id = req.params.id;

  try {
    const listing = await pool.query(
      `
      SELECT 
        l.listing_id,
        l.listing_title,
        l.description AS listing_description,
        l.price,
        l.credit,
        array_to_json(l.package_types) AS package_types,
        array_to_json(l.age_groups) AS age_groups,
        l.images,
        l.rating AS listing_rating,
        l.created_on AS listing_created_on,
        l.active,
        json_build_object(
          'partner_id', p.partner_id,
          'partner_name', p.partner_name,
          'email', p.email,
          'categories', p.categories,
          'contact_number', p.contact_number,
          'rating', p.rating,
          'picture', p.picture,
          'website', p.website
        ) AS partner_info,
        COALESCE(
            json_agg(
                json_build_object(
                    'outlet_id', o.outlet_id,
                    'address', o.address,
                    'nearest_mrt', o.nearest_mrt,
                    'created_on', o.created_on,
                    'schedules', os.schedules
                )
            ) FILTER (WHERE o.outlet_id IS NOT NULL),
            '[]'::json
        ) AS outlets
      FROM listings l
      LEFT JOIN partners p ON p.partner_id = l.partner_id
      LEFT JOIN outlets o ON o.listing_id = l.listing_id
      LEFT JOIN LATERAL (
          SELECT 
              json_agg(
                  json_build_object(
                      'schedule_id', s.schedule_id,
                      'day', s.day,
                      'timeslot', s.timeslot,
                      'frequency', s.frequency,
                      'created_on', s.created_on
                  )
              ) AS schedules
          FROM schedules s
          WHERE s.outlet_id = o.outlet_id
      ) os ON true
      WHERE l.listing_id = $1
      GROUP BY 
          l.listing_id, p.partner_id
      ORDER BY 
          l.created_on DESC;`,
      [id]
    );

    return res.status(200).json(listing.rows[0]);
  } catch (err) {
    console.error(`ERROR in /listings/${id} GET`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// get listing by partner_id
router.get("/partner/:partnerId", async (req, res) => {
  const { partnerId } = req.params;

  try {
    const listings = await pool.query(
      `
      SELECT 
        l.listing_id,
        l.listing_title,
        l.description AS listing_description,
        l.price,
        l.credit,
        array_to_json(l.package_types) AS package_types,
        array_to_json(l.age_groups) AS age_groups,
        l.images,
        l.rating AS listing_rating,
        l.created_on AS listing_created_on,
        l.active,
        json_build_object(
          'partner_id', p.partner_id,
          'partner_name', p.partner_name,
          'email', p.email,
          'categories', p.categories,
          'contact_number', p.contact_number,
          'rating', p.rating,
          'picture', p.picture,
          'website', p.website
        ) AS partner_info,
        COALESCE(
            json_agg(
                json_build_object(
                    'outlet_id', o.outlet_id,
                    'address', o.address,
                    'nearest_mrt', o.nearest_mrt,
                    'created_on', o.created_on,
                    'schedules', os.schedules
                )
            ) FILTER (WHERE o.outlet_id IS NOT NULL),
            '[]'::json
        ) AS outlets
      FROM listings l
      LEFT JOIN partners p ON p.partner_id = l.partner_id
      LEFT JOIN outlets o ON o.listing_id = l.listing_id
      LEFT JOIN LATERAL (
          SELECT 
              json_agg(
                  json_build_object(
                      'schedule_id', s.schedule_id,
                      'day', s.day,
                      'timeslot', s.timeslot,
                      'frequency', s.frequency,
                      'created_on', s.created_on
                  )
              ) AS schedules
          FROM schedules s
          WHERE s.outlet_id = o.outlet_id
      ) os ON true
      WHERE l.partner_id = $1
      GROUP BY 
          l.listing_id, p.partner_id
      ORDER BY 
          l.created_on DESC;`,
      [partnerId]
    );

    return res.status(200).json(listings.rows);
  } catch (error) {
    console.error(`ERROR in /listings/partner/${partnerId} GET`, error.message);
    res.status(500).json({ error: error.message });
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
  } catch (error) {
    console.error(`ERROR in /listings/${id} PUT`, error.message);
    res.status(500).json({ error: error.message });
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
  } catch (error) {
    console.error(`ERROR in /listings/${id} DELETE`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// make it inactive
router.patch("/:listing_id/status", async (req, res) => {
  const { listing_id } = req.params;
  const { active } = req.body;

  try {
    await pool.query(`UPDATE listings SET active = $1 WHERE listing_id = $2`, [
      active,
      listing_id,
    ]);
    res.status(200).json({
      message: "Listing status updated successfully.",
    });
  } catch (error) {
    console.error(
      `ERROR in /listings/${listing_id}/status PATCH`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
