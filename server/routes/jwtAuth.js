const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");
const etagMiddleware = require("../middleware/etagMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");
const { OAuth2Client } = require("google-auth-library");
const sendEmail = require("../utils/emailSender");
const {
  resetPasswordHtmlTemplate,
} = require("../utils/resetPasswordHtmlTemplate");
const { otpHtmlTemplate } = require("../utils/otpHtmlTemplate");
const client = new OAuth2Client(process.env.googleClientID);

router.use(etagMiddleware);

router.get("/", authorization, async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      req.user,
    ]);

    return res.status(200).json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/register", validInfo, async (req, res) => {
  const { name, phoneNumber, email, password } = req.body;

  try {
    // check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // decode phone number from base64
    const decodedPhoneNumber = Buffer.from(phoneNumber, "base64").toString(
      "utf-8"
    );

    // check if phone number exists
    const phoneExist = await pool.query(
      "SELECT * FROM users WHERE phone_number = $1",
      [decodedPhoneNumber]
    );

    if (user.rows.length !== 0) {
      return res
        .status(401)
        .json({ message: "User already exist in database. Please login" });
    }

    if (phoneExist.rows.length !== 0) {
      return res.status(401).json({
        message: "Phone number already in use. Please use a different number.",
      });
    }

    // bcrypt password
    const saltRound = 10;
    const bcryptedPassword = bcrypt.hashSync(password, saltRound);

    const newUser = await pool.query(
      `INSERT INTO users(name, user_type, email, password, phone_number, method)
       VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, "parent", email, bcryptedPassword, decodedPhoneNumber, "email"]
    );

    if (newUser) {
      await pool.query(
        "INSERT INTO parents (parent_id) VALUES($1) RETURNING *",
        [newUser.rows[0].user_id]
      );
    }

    // generate jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);
    return res.status(200).json({ token, newUser: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", validInfo, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    const token = jwtGenerator(user.rows[0].user_id);
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/login/google", async (req, res) => {
  try {
    const { googleCredential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: googleCredential,
      audience: process.env.googleClientID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, email_verified } = payload;

    const existingUser = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length === 0) {
      // new user, register
      const newUser = await pool.query(
        `INSERT INTO users (email, name, user_type, method, display_picture) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [email, name, "parent", "gmail", picture]
      );

      if (newUser) {
        await pool.query(
          "INSERT INTO parents (parent_id) VALUES($1) RETURNING *",
          [newUser.rows[0].user_id]
        );
      }

      const token = jwtGenerator(newUser.rows[0].user_id);
      return res.status(200).json({ token, newUser: true });
    }

    // existing Gmail user
    const token = jwtGenerator(existingUser.rows[0].user_id);
    return res.status(200).json({ token, newUser: false });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rowCount === 0)
      return res.status(404).json({
        message: "User not found in the database",
      });

    const userId = userResult.rows[0].user_id;

    // check if user is using google or email
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      userId,
    ]);

    if (user && user.rows[0].method === "gmail")
      return res.status(400).json({
        message:
          "Password reset is not available for Gmail users. Please login using Gmail.",
      });

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(token, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await pool.query(
      `INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [userId, hashedToken, expiresAt]
    );

    const resetURL = `https://www.juniorpass.sg/reset-password?token=${hashedToken}`;
    const emailContent = resetPasswordHtmlTemplate(resetURL);

    await sendEmail(email, "Password Reset Request", emailContent);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Error in forgot-password route:", err);
    res.status(500).json({ error: err });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const resetResult = await pool.query(
      `SELECT user_id, expires_at FROM password_resets WHERE token = $1`,
      [token]
    );

    if (resetResult.rows.length === 0)
      return res.status(400).json({ message: "Invalid or expired token" });

    const { user_id, expires_at } = resetResult.rows[0];

    if (new Date() > new Date(expires_at)) {
      return res.status(400).json({ message: "Token expired" });
    }

    const saltRound = 10;
    const bcryptedPassword = bcrypt.hashSync(newPassword, saltRound);

    await pool.query(`UPDATE users SET password = $1 WHERE user_id = $2`, [
      bcryptedPassword,
      user_id,
    ]);

    await pool.query(`DELETE FROM password_resets WHERE user_id = $1`, [
      user_id,
    ]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error in reset-password route:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  try {
    // check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res
        .status(401)
        .json({ message: "User already exist in database. Please login" });
    }

    // email is available
    return res.status(200).json({
      available: true,
      message: "Email is available",
    });
  } catch (err) {
    console.error("Error in check-email route: ", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    await pool.query(
      `
    INSERT INTO otpRequests(email, otp, expires_at) VALUES($1, $2, $3)`,
      [email, code, expiresAt]
    );

    const emailContent = otpHtmlTemplate(code);
    await sendEmail(email, "OTP Request", emailContent);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error in send-otp route:", err);
    res.status(500).json({ error: err });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpResult = await pool.query(
      `SELECT * FROM otpRequests WHERE email = $1 AND otp = $2 AND expires_at > NOW() AND is_verified = false`,
      [email, otp]
    );
    if (otpResult.rows.length === 0)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    // mark OTP as verified
    await pool.query(
      `UPDATE otpRequests SET is_verified = true WHERE email = $1 AND otp = $2`,
      [email, otp]
    );

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error in verify-otp route:", err);
    res.status(500).json({ error: err });
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    return res.status(200).json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/getAllUsers", cacheMiddleware, async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users");
    return res.status(200).json(user.rows);
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
