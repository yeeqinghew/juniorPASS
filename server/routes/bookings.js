const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.post('/', authorization, async (req, res) => {
  const { listing_id, start_date, end_date, child_id } = req.body;

  try {
    // Validate request body
    if (!listing_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Retrieve listing and user data
    const listing = await pool.query('SELECT * FROM listings WHERE listing_id = $1', [listing_id]);
    const user_id = req.user;
    const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);

    if (listing.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Optional: validate child belongs to this parent if provided
    if (child_id) {
      const child = await pool.query(
        "SELECT child_id FROM children WHERE child_id = $1 AND parent_id = $2",
        [child_id, user_id]
      );
      if (child.rowCount === 0) {
        return res.status(400).json({ error: 'Invalid child_id for this parent' });
      }
    }

    const creditCost = listing.rows[0].credit;
    const userCredits = user.rows[0].credit;

    // Check user's credit balance
    if (userCredits < creditCost) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    // Check for overlapping bookings
    const overlappingBookings = await pool.query(`
      SELECT * FROM bookings 
      WHERE user_id = $1 AND (
        (start_date <= $2 AND end_date >= $2) OR
        (start_date <= $3 AND end_date >= $3) OR
        (start_date >= $2 AND end_date <= $3)
      )
    `, [user_id, start_date, end_date]);

    if (overlappingBookings.rows.length > 0) {
      return res.status(400).json({ error: 'Overlapping booking exists' });
    }

    // Perform booking within transaction
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Deduct credits from user balance
      await client.query('UPDATE users SET credit = credit - $1 WHERE user_id = $2', [creditCost, user_id]);

      // Credit partner balance
      await client.query('UPDATE partners SET credit = credit + $1 WHERE partner_id = $2', [creditCost, listing.rows[0].partner_id]);

      // Create booking record
      const newBooking = await client.query(`
        INSERT INTO bookings (listing_id, user_id, start_date, end_date)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [listing_id, user_id, start_date, end_date]);

      // Record parent's debit transaction if child context is provided
      if (child_id) {
        await client.query(
          `INSERT INTO transactions (parent_id, child_id, listing_id, used_credit, transaction_type)
           VALUES ($1, $2, $3, $4, $5)`,
          [user_id, child_id, listing_id, creditCost, 'DEBIT']
        );
      }

      // Update listing availability
      // TODO: Update based on listing's availability logic

      await client.query('COMMIT');

      // Insert partner notification for new booking
      try {
        await pool.query(
          `INSERT INTO notifications (recipient_type, recipient_id, type, title, message, data)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            'partner',
            listing.rows[0].partner_id,
            'booking',
            'New booking: ' + listing.rows[0].listing_title,
            'A new booking has been made.',
            JSON.stringify({ user_id, listing_id, start_date, end_date, credit: creditCost })
          ]
        );
      } catch (notifyErr) {
        console.error('Failed to insert booking notification:', notifyErr.message);
      }

      // Insert user notification for new booking
      try {
        await pool.query(
          `INSERT INTO notifications (recipient_type, recipient_id, type, title, message, data)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            'user',
            user_id,
            'booking',
            'Booking confirmed',
            'Your class has been booked.',
            JSON.stringify({ listing_id, start_date, end_date, credit: creditCost })
          ]
        );
      } catch (notifyErr) {
        console.error('Failed to insert user booking notification:', notifyErr.message);
      }

      res.status(201).json({ 
        message: 'Booking created successfully',
        booking: newBooking.rows[0],
        updated_credit: userCredits - creditCost,
      });

    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

});

module.exports = router;
