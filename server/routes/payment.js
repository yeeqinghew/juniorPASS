const express = require("express");
const router = express.Router();
const pool = require("../db");
const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch"); // <-- Required for Node.js <18

router.post("/init", async (req, res) => {
  // sandbox env
  const { amount, user } = req.body;
  const { user_id, email, name } = user;

  const ref_num = uuidv4(); // Generate a unique reference number
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
        name,
        purpose: "",
        description: "Top up store credit",
        paymentMethods: ["paynow_online", "card"],
        reference_number: ref_num, // TODO: generate unique reference number
        redirect_url: "", // Not redirecting to any URL after payment due to Drop-In UI
        webhook_url: "http://localhost:5000/payment/webhook", // TODO
        expiry_date: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes expiry
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
    url: response.url,
    reference_number,
  });
  // TODO: return the url to the client for init
  // TODO: return the id to the client for paymentRequest, amount, method for toggle
});

router.post("/webhook", async (req, res) => {
  try {
    const event = req.body;
    const { id: hitpayPaymentId, reference_number, status } = event;

    const result = await pool.query(
      `UPDATE payment_requests 
    SET status = $1, webhook_received = true, updated_at = NOW()
    WHERE hitpay_payment_id = $2 AND reference_number = $3
    RETURNING user_id, amount`,
      [status.toUpperCase(), hitpayPaymentId, reference_number]
    );

    if (result.rowCount === 1 && status === "completed") {
      const { user_id, amount } = result.rows[0];

      await pool.query(
        `UPDATE users 
      SET store_credit = credit + $1
      WHERE user_id = $2`,
        [amount, user_id]
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

module.exports = router;
