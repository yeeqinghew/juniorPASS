const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// GET /notifications/initial
// Fetch initial (latest 10) notifications for the logged-in partner
router.get("/initial", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const limit = 10;

    const result = await pool.query(
      `SELECT id, parent_name AS "parentName", parent_id AS "parentUserId",
              listing_title AS "listingTitle", read, created_on AS "timestamp"
        FROM notifications
        WHERE partner_id = $1
        ORDER BY created_on DESC, id DESC
        LIMIT $2`,
      [user_id, limit]
    );

    const formatted = result.rows.map((n) => ({
      ...n,
      timestamp: n.timestamp,
    }));

    res.json({ notifications: formatted });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /notifications/more?offset=10
// Fetch more notifications using offset-based pagination
router.get("/more", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = 10;

    const result = await pool.query(
      `SELECT id, parent_name AS "parentName", parent_id AS "parentUserId",
              listing_title AS "listingTitle", read, created_on AS "timestamp"
        FROM notifications
        WHERE partner_id = $1
        ORDER BY created_on DESC, id DESC
        LIMIT $2 OFFSET $3`,
      [user_id, limit, offset]
    );

    const formatted = result.rows.map((n) => ({
      ...n,
      timestamp: n.timestamp,
    }));

    res.json({ notifications: formatted });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /notifications/mark-read
// Mark an array of notification IDs as read for the logged-in partner
router.patch("/mark-read", authorization, async (req, res) => {
  const { ids } = req.body;
  const user_id = req.user;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "No IDs provided" });
  }

  try {
    await pool.query(
      `UPDATE notifications SET read = true
       WHERE id = ANY($1) AND partner_id = $2`,
      [ids, user_id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /notifications/unread-count
// Count how many unread notifications exist for the partner
router.get("/unread-count", authorization, async (req, res) => {
  try {
    const user_id = req.user;

    const result = await pool.query(
      `SELECT COUNT(*) FROM notifications WHERE partner_id = $1 AND read = false`,
      [user_id]
    );

    res.json({ unreadCount: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error("Error fetching unread count:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /notifications/count
// Total notification count for polling (used to detect new ones)
router.get("/count", authorization, async (req, res) => {
  try {
    const user_id = req.user; // Partner ID
    const result = await pool.query(
      `SELECT COUNT(*) FROM notifications WHERE partner_id = $1`,
      [user_id]
    );
    res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error("Error fetching count:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /notifications/:id
// Fetch full details of a single notification (partner-only)
router.get("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user;

    const partnerResult = await pool.query(
      "SELECT partner_id FROM partners WHERE partner_id = $1",
      [user_id]
    );

    if (partnerResult.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized: not a vendor" });
    }

    const partner_id = partnerResult.rows[0].partner_id;

    const notifResult = await pool.query(
      `SELECT 
         id, parent_name AS "parentName", parent_id AS "parentUserId",
         listing_title AS "listingTitle", child_name AS "childName",
         child_age AS "childAge", child_gender AS "childGender",
         read, created_on AS "timestamp"
       FROM notifications
       WHERE id = $1 AND partner_id = $2`,
      [id, partner_id]
    );

    if (notifResult.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(notifResult.rows[0]);
  } catch (err) {
    console.error("Error fetching notification detail:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
