const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const pool = require("../db");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const querystring = require("querystring");

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

// initiates payment and stores it.
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

// updates payment and credit if successful.
router.post("/webhook", async (req, res) => {
  const secret = process.env.hitPaySandboxSecretKey;

  const rawBody = req.body;

  // Parse the body to extract parameters
  const parsed = querystring.parse(rawBody.toString("utf8"));
  const receivedHmac = parsed.hmac;

  if (!receivedHmac) {
    console.error("❌ No HMAC received");
    return res.status(400).send("Bad Request - No HMAC");
  }

  // Step 1: Remove the hmac parameter
  const { hmac, ...dataWithoutHmac } = parsed;

  // Step 2: Sort keys alphabetically
  const sortedKeys = Object.keys(dataWithoutHmac).sort();

  // Step 3: Concatenate keys and values WITHOUT "&" and "=" separators
  let concatenatedString = "";
  for (const key of sortedKeys) {
    concatenatedString += key + dataWithoutHmac[key];
  }

  // Step 4: Calculate HMAC using the concatenated string
  const calculatedHmac = crypto
    .createHmac("sha256", secret)
    .update(concatenatedString)
    .digest("hex");

  if (calculatedHmac !== receivedHmac) {
    console.error("❌ Invalid HMAC!");
    console.error("String used for HMAC calculation:", concatenatedString);
    return res.status(401).send("Unauthorized");
  }

  // Respond first before processing
  res.status(200).send("OK");

  // Process the webhook data
  const { payment_id, reference_number, amount, status } = parsed;
  try {
    if (status === "completed") {
      // Get user_id from the database using reference_number
      const paymentResult = await pool.query(
        `SELECT user_id FROM payment_requests WHERE reference_number = $1`,
        [reference_number]
      );

      if (paymentResult.rowCount === 0) {
        console.error(
          `❌ Payment request not found for reference: ${reference_number}`
        );
        return res.status(404).send("Payment request not found");
      }

      const { user_id } = paymentResult.rows[0];

      await markPaymentCompleted({
        hitpayPaymentId: payment_id,
        reference_number,
        amount: parseFloat(amount),
        user_id,
      });

      console.log(`✅ Payment ${payment_id} marked as completed`);
    } else {
      console.log(`ℹ️ Payment ${payment_id} status: ${status}`);
    }
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
  }
});

// polls for frontend status checking.
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

// fallback when webhook fails (manual confirmation).
router.get("/verify/:reference_number", async (req, res) => {
  const { reference_number } = req.params;
  try {
    // Get payment request ID from DB
    const result = await pool.query(
      `SELECT user_id, hitpay_payment_id, amount FROM payment_requests 
       WHERE reference_number = $1`,
      [reference_number]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Payment request not found" });
    }

    const { user_id, hitpay_payment_id, amount } = result.rows[0];
    // Fallback: Fetch from HitPay directly
    const response = await fetch(
      `https://api.sandbox.hit-pay.com/v1/payment-requests/${hitpay_payment_id}`,
      {
        method: "GET",
        headers: {
          "X-BUSINESS-API-KEY": process.env.hitPaySandboxApiKey,
        },
      }
    );

    const data = await response.json();

    if (data.status === "completed") {
      await markPaymentCompleted({
        hitpayPaymentId: data.id,
        reference_number,
        amount,
        user_id,
      });
      return res.status(200).json({ status: "COMPLETED" });
    }

    return res.status(200).json({
      status: data.status,
    });
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
  const existing = await pool.query(
    `SELECT status FROM payment_requests 
     WHERE hitpay_payment_id = $1 AND reference_number = $2`,
    [hitpayPaymentId, reference_number]
  );

  if (existing.rows[0]?.status === "COMPLETED") {
    console.log("Payment already marked as completed.");
    return;
  }

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
