const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const pool = require("../db");
const { v4: uuidv4 } = require("uuid");

function formatSGDateTime(date) {
  // Convert to Singapore time (GMT+8)
  const sgOffset = 8 * 60; // in minutes
  const localOffset = date.getTimezoneOffset(); // in minutes
  const diff = sgOffset + localOffset;

  const sgTime = new Date(date.getTime() + diff * 60 * 1000);

  const pad = (n) => n.toString().padStart(2, "0");

  const year = sgTime.getFullYear();
  const month = pad(sgTime.getMonth() + 1);
  const day = pad(sgTime.getDate());
  const hours = pad(sgTime.getHours());
  const minutes = pad(sgTime.getMinutes());
  const seconds = pad(sgTime.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

router.post("/init", async (req, res) => {
  // sandbox env
  const { amount, user } = req.body;
  const { user_id, email, name } = user;

  const ref_num = uuidv4(); // Generate a unique reference number
  // Generate expiry 10 minutes from now
  const expiryDate = formatSGDateTime(new Date(Date.now() + 10 * 60 * 1000));

  const resp = await fetch(
    "https://api.sandbox.hit-pay.com/v1/payment-requests",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BUSINESS-API-KEY": process.env.hitPaySandboxApiKey,
      },
      body: JSON.stringify({
        amount,
        currency: "SGD",
        email,
        purpose: "",
        name,
        reference_number: ref_num, // TODO: generate unique reference number
        description: "Top up store credit",
        redirect_url: "", // Not redirecting to any URL after payment due to Drop-In UI
        webhook: "https://1d8c-119-74-36-169.ngrok-free.app/payment/webhook", // TODO
        expiry_date: expiryDate, // 10 minutes expiry
      }),
    }
  );

  const response = await resp.json();
  const {
    id,
    name: resName,
    email: resEmail,
    phone,
    amount: resAmount,
    currency,
    status,
    purpose,
    reference_number,
    payment_methods,
    url,
    redirect_url,
    webhook,
    send_sms,
    send_email,
    sms_status,
    email_status,
    allow_repeated_payments,
    expiry_date,
    created_at,
    updated_at,
  } = response;

  await pool.query(
    `INSERT INTO payment_requests
      (user_id, amount, reference_number, hitpay_payment_id) 
      VALUES ($1, $2, $3, $4)`,
    [user_id, amount, reference_number, response.id]
  );

  res.status(200).json({
    id: response.id,
    url: response.url,
    reference_number,
  });
});

router.post("/webhook", async (req, res) => {
  try {
    const event = req.body;
    const {
      payment_id,
      payment_request_id: hitpayPaymentId,
      phone,
      amount,
      currency,
      reference_number,
      status,
      hmac,
    } = event;

    if (status === "completed") {
      const result = await pool.query(
        `SELECT user_id, amount FROM payment_requests
         WHERE hitpay_payment_id = $1 AND reference_number = $2`,
        [hitpayPaymentId, reference_number]
      );

      if (result.rowCount === 0) {
        console.error("No matching payment request found");
        return res.status(404).send("Payment request not found");
      }

      const { user_id, amount } = result.rows[0];
      await markPaymentCompleted({
        hitpayPaymentId,
        reference_number,
        amount,
        user_id,
      });
    } else {
      await pool.query(
        `UPDATE payment_requests 
         SET status = $1, webhook_received = true, updated_at = NOW()
         WHERE hitpay_payment_id = $2 AND reference_number = $3`,
        [status.toUpperCase(), hitpayPaymentId, reference_number]
      );
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/status/:reference_number", async (req, res) => {
  const { reference_number } = req.params;

  try {
    const result = await pool.query(
      `SELECT status, webhook_received, updated_at 
       FROM payment_requests 
       WHERE reference_number = $1`,
      [reference_number]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error checking status");
  }
});

router.get("/verify/:reference_number", async (req, res) => {
  const { reference_number } = req.params;
  try {
    // Fallback: Fetch from HitPay directly
    const response = await fetch(
      `https://api.sandbox.hit-pay.com/v1/payment-requests/${reference_number}`,
      {
        method: "GET",
        headers: {
          "X-BUSINESS-API-KEY": process.env.hitPaySandboxApiKey,
        },
      }
    );

    const data = await response.json();

    if (data.status === "COMPLETED") {
      // Get user ID
      const result = await pool.query(
        `SELECT user_id, amount FROM payment_requests
        WHERE reference_number = $1`,
        [reference_number]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Payment request not found" });
      }

      const { user_id, amount } = result.rows[0];
      await markPaymentCompleted({
        hitpayPaymentId: data.id,
        reference_number,
        amount,
        user_id,
      });
      res.status(200).json({ status: "COMPLETED" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error verifying payment");
  }
});

async function markPaymentCompleted({
  hitpayPaymentId,
  reference_number,
  amount,
  user_id,
}) {
  await pool.query(
    `UPDATE payment_requests 
     SET status = $1, webhook_received = true, updated_at = NOW()
     WHERE hitpay_payment_id = $2 AND reference_number = $3`,
    ["COMPLETED", hitpayPaymentId, reference_number]
  );

  await pool.query(
    `UPDATE users 
     SET credit = credit + $1
     WHERE user_id = $2`,
    [amount, user_id]
  );
}

module.exports = router;
