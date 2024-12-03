const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");
const etagMiddleware = require("../middleware/etagMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.googleClientID);

router.use(etagMiddleware);

router.get("/", authorization, cacheMiddleware, async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      req.user,
    ]);

    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

router.post("/register", validInfo, async (req, res) => {
  const { userType, name, phoneNumber, email, password, method } = req.body;

  try {
    // check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).json("User already exist");
    }

    // bcrypt password
    const saltRound = 10;
    const bcryptedPassword = bcrypt.hashSync(password, saltRound);

    const newUser = await pool.query(
      "INSERT INTO users(name, user_type, email, password, phone_number, method, created_on) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        name,
        userType,
        email,
        bcryptedPassword,
        phoneNumber,
        method,
        new Date().toLocaleString(),
      ]
    );

    if (newUser) {
      await pool.query(
        "INSERT INTO parents (parent_id) VALUES($1) RETURNING *",
        [newUser.rows[0].user_id]
      );
    }

    // generate jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
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
    return res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.post("/login/google", async (req, res) => {
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
    const newUserResult = await pool.query(
      `INSERT INTO users (email, name, user_type, method, display_picture, created_on) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [email, name, "parent", "gmail", picture, new Date().toLocaleString()]
    );
    const userId = newUserResult.rows[0].user_id;
    const token = jwtGenerator(userId);
    return res.json({ token, newUser: true });
  }

  // existing Gmail user
  const token = jwtGenerator(existingUser.rows[0].user_id);
  return res.json({ token, newUser: false });
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/getAllUsers", cacheMiddleware, async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users");
    res.json(user.rows);
  } catch (error) {
    console.error(err.message);
    res.status(500);
  }
});

module.exports = router;
