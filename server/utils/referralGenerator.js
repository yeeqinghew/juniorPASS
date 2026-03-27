const pool = require("../db");

// Generate a unique referral code for user
const generateReferralCode = async (userId) => {
  let code;
  let isUnique = false;

  while (!isUnique) {
    // Generate random 8-character alphanumeric code
    code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const existing = await pool.query(
      "SELECT * FROM referral_codes WHERE code = $1",
      [code],
    );
    isUnique = existing.rows.length === 0;
  }

  await pool.query(
    "INSERT INTO referral_codes (user_id, code) VALUES ($1, $2)",
    [userId, code],
  );

  return code;
};

module.exports = { generateReferralCode };
