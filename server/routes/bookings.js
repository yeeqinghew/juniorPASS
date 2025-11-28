const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {
  const { listing_id, start_date, end_date, child_id } = req.body;

  try {
    // Validate request body
    if (!listing_id || !start_date || !end_date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Retrieve listing and user data
    const listing = await pool.query(
      "SELECT * FROM listings WHERE listing_id = $1",
      [listing_id]
    );
    const user_id = req.user;
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);

    if (listing.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Optional: validate child belongs to this parent if provided
    if (child_id) {
      const child = await pool.query(
        "SELECT child_id FROM children WHERE child_id = $1 AND parent_id = $2",
        [child_id, user_id]
      );
      if (child.rowCount === 0) {
        return res
          .status(400)
          .json({ error: "Invalid child_id for this parent" });
      }
    }

    const creditCost = listing.rows[0].credit;
    const userCredits = user.rows[0].credit;

    // Check user's credit balance
    if (userCredits < creditCost) {
      return res.status(400).json({ error: "Insufficient credits" });
    }

    // Check for overlapping bookings for this user
    const overlappingBookings = await pool.query(
      `
      SELECT * FROM bookings 
      WHERE user_id = $1 AND (
        (start_date <= $2 AND end_date >= $2) OR
        (start_date <= $3 AND end_date >= $3) OR
        (start_date >= $2 AND end_date <= $3)
      )
    `,
      [user_id, start_date, end_date]
    );

    if (overlappingBookings.rows.length > 0) {
      return res.status(400).json({ error: "You already have a booking at this time" });
    }

    // Check if the class time slot is full
    const maxCapacity = listing.rows[0].max_capacity || 1;
    const existingBookings = await pool.query(
      `SELECT COUNT(*) as count 
       FROM bookings 
       WHERE listing_id = $1 
       AND start_date = $2 
       AND end_date = $3`,
      [listing_id, start_date, end_date]
    );

    const bookedCount = parseInt(existingBookings.rows[0].count);
    if (bookedCount >= maxCapacity) {
      return res.status(400).json({ 
        error: "This class is fully booked",
        booked_count: bookedCount,
        max_capacity: maxCapacity
      });
    }

    // Perform booking within transaction
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Deduct credits from user balance
      await client.query(
        "UPDATE users SET credit = credit - $1 WHERE user_id = $2",
        [creditCost, user_id]
      );

      // Credit partner balance
      await client.query(
        "UPDATE partners SET credit = credit + $1 WHERE partner_id = $2",
        [creditCost, listing.rows[0].partner_id]
      );

      // Create booking record
      const newBooking = await client.query(
        `
        INSERT INTO bookings (listing_id, user_id, start_date, end_date)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
        [listing_id, user_id, start_date, end_date]
      );

      // Record parent's debit transaction if child context is provided
      if (child_id) {
        await client.query(
          `INSERT INTO transactions (parent_id, child_id, listing_id, used_credit, transaction_type)
           VALUES ($1, $2, $3, $4, $5)`,
          [user_id, child_id, listing_id, creditCost, "DEBIT"]
        );
      }

      await client.query("COMMIT");

      // Insert partner notification for new booking
      try {
        await pool.query(
          `INSERT INTO notifications (recipient_type, recipient_id, type, title, message, data)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            "partner",
            listing.rows[0].partner_id,
            "booking",
            "New booking: " + listing.rows[0].listing_title,
            "A new booking has been made.",
            JSON.stringify({
              user_id,
              listing_id,
              start_date,
              end_date,
              credit: creditCost,
            }),
          ]
        );
      } catch (notifyErr) {
        console.error(
          "Failed to insert booking notification:",
          notifyErr.message
        );
      }

      // Insert user notification for new booking
      try {
        await pool.query(
          `INSERT INTO notifications (recipient_type, recipient_id, type, title, message, data)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            "user",
            user_id,
            "booking",
            "Booking confirmed",
            "Your class has been booked.",
            JSON.stringify({
              listing_id,
              start_date,
              end_date,
              credit: creditCost,
            }),
          ]
        );
      } catch (notifyErr) {
        console.error(
          "Failed to insert user booking notification:",
          notifyErr.message
        );
      }

      res.status(201).json({
        message: "Booking created successfully",
        booking: newBooking.rows[0],
        updated_credit: userCredits - creditCost,
      });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET availability for a specific time slot
router.get("/availability/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ error: "Missing start_date or end_date" });
    }

    // Get listing with max_capacity
    const listing = await pool.query(
      "SELECT listing_id, listing_title, max_capacity FROM listings WHERE listing_id = $1",
      [listingId]
    );

    if (listing.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const maxCapacity = listing.rows[0].max_capacity || 1;

    // Count existing bookings for this time slot
    const bookings = await pool.query(
      `SELECT COUNT(*) as count 
       FROM bookings 
       WHERE listing_id = $1 
       AND start_date = $2 
       AND end_date = $3`,
      [listingId, start_date, end_date]
    );

    const bookedCount = parseInt(bookings.rows[0].count);
    const availableSpots = maxCapacity - bookedCount;
    const isFull = bookedCount >= maxCapacity;

    res.json({
      success: true,
      listing_id: listingId,
      start_date,
      end_date,
      max_capacity: maxCapacity,
      booked_count: bookedCount,
      available_spots: availableSpots,
      is_full: isFull
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all bookings for a user
router.get("/user", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const bookings = await pool.query(
      `
      SELECT 
        b.*,
        l.listing_title,
        l.description as listing_description,
        l.images,
        p.partner_name,
        p.picture as partner_picture
      FROM bookings b
      JOIN listings l ON b.listing_id = l.listing_id
      JOIN partners p ON l.partner_id = p.partner_id
      WHERE b.user_id = $1
      ORDER BY b.start_date DESC
    `,
      [user_id]
    );

    res.json({
      success: true,
      bookings: bookings.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all bookings for a partner
router.get("/partner/:partnerId", authorization, async (req, res) => {
  try {
    const { partnerId } = req.params;

    const bookings = await pool.query(
      `
      SELECT 
        b.*,
        l.listing_title,
        u.name as user_name,
        u.email as user_email,
        u.contact_number as user_contact
      FROM bookings b
      JOIN listings l ON b.listing_id = l.listing_id
      JOIN users u ON b.user_id = u.user_id
      WHERE l.partner_id = $1
      ORDER BY b.start_date DESC
    `,
      [partnerId]
    );

    res.json({
      success: true,
      bookings: bookings.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE/Cancel a booking
router.delete("/:bookingId", authorization, async (req, res) => {
  const { bookingId } = req.params;
  const user_id = req.user;

  try {
    // Get booking details with listing information
    const booking = await pool.query(
      `
      SELECT 
        b.booking_id,
        b.listing_id,
        b.user_id,
        b.start_date,
        b.end_date,
        b.created_on,
        l.credit,
        l.partner_id,
        l.listing_title
      FROM bookings b
      JOIN listings l ON b.listing_id = l.listing_id
      WHERE b.booking_id = $1 AND b.user_id = $2
    `,
      [bookingId, user_id]
    );

    if (booking.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Booking not found or unauthorized" });
    }

    const bookingData = booking.rows[0];
    const creditRefund = bookingData.credit;

    // Perform cancellation within transaction
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Refund credits to user
      await client.query(
        "UPDATE users SET credit = credit + $1 WHERE user_id = $2",
        [creditRefund, user_id]
      );

      // Deduct from partner balance
      await client.query(
        "UPDATE partners SET credit = credit - $1 WHERE partner_id = $2",
        [creditRefund, bookingData.partner_id]
      );

      // Delete booking
      await client.query("DELETE FROM bookings WHERE booking_id = $1", [
        bookingId,
      ]);

      await client.query("COMMIT");

      // Notify partner about cancellation
      try {
        await pool.query(
          `INSERT INTO notifications (recipient_type, recipient_id, type, title, message, data)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            "partner",
            bookingData.partner_id,
            "cancellation",
            "Booking cancelled: " + bookingData.listing_title,
            "A booking has been cancelled.",
            JSON.stringify({
              user_id,
              booking_id: bookingId,
              credit: creditRefund,
            }),
          ]
        );
      } catch (notifyErr) {
        console.error(
          "Failed to insert cancellation notification:",
          notifyErr.message
        );
      }

      // Notify user about cancellation confirmation
      try {
        await pool.query(
          `INSERT INTO notifications (recipient_type, recipient_id, type, title, message, data)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            "user",
            user_id,
            "cancellation",
            "Booking cancelled",
            "Your booking has been cancelled and credits refunded.",
            JSON.stringify({ booking_id: bookingId, credit: creditRefund }),
          ]
        );
      } catch (notifyErr) {
        console.error(
          "Failed to insert user cancellation notification:",
          notifyErr.message
        );
      }

      res.json({
        success: true,
        message: "Booking cancelled successfully",
        refunded_credit: creditRefund,
      });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
