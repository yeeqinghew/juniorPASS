const express = require("express");
const router = express.Router();
const pool = require("../db");
const etagMiddleware = require("../middleware/etagMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");
const client = require("../utils/redisClient");
router.use(etagMiddleware);

// router.post("/add-child", authorization, async (req, res) => {
router.post("", cacheMiddleware, async (req, res) => {
  const { name, age, gender, parent_id } = req.body;
  try {
    const newChild = await pool.query(
      `INSERT INTO children (name, age, gender, parent_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, age, gender, parent_id]
    );

    // Optionally, invalidate or update related cache entries, like the list of all listings
    await client.del(`/children/${parent_id}`);

    res.status(201).json({
      message: "Child has been created!",
      data: newChild,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:parent_id", cacheMiddleware, async (req, res) => {
  const parent_id = req.params.parent_id;

  try {
    const children = await pool.query(
      "SELECT * FROM children WHERE parent_id = $1",
      [parent_id]
    );
    return res.status(200).json(children.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get schedule for a specific child
router.get("/:child_id/schedule", async (req, res) => {
  try {
    const { child_id } = req.params;

    const childSchedule = await pool.query(
      `
      SELECT
        s.day,
        s.timeslot               AS class_time,
        l.listing_title,
        l.active,
        regexp_replace(
          o.address,
          '.*(\\d{6}).*',
          '\\1'
        )                       AS postal_code
      FROM transactions t
      JOIN children c            ON t.child_id = c.child_id
      JOIN listings l            ON t.listing_id = l.listing_id
      JOIN listingOutlets lo     ON lo.listing_id = l.listing_id
      JOIN outlets o             ON lo.outlet_id = o.outlet_id
      JOIN schedules s           ON lo.listing_outlet_id = s.listing_outlet_id
      WHERE c.child_id = $1
        AND l.active   = TRUE
      ORDER BY s.day;
      `,
      [child_id]
    );

    res.status(200).json(childSchedule.rows);
  } catch (error) {
    console.error("Error fetching child schedule:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
