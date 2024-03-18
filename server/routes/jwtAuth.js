const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
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
  const {
    userType,
    name,
    phoneNumber,
    email,
    password,
    method,
    // token: jwtToken,
  } = req.body;
  // const decodedInfo = jwtDecode(jwtToken);

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

    // TODO: userType = parent -> create an entry in parent table

    // generate jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.json({ token, method });
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

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/getAllUsers", async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users");
    res.json(user.rows);
  } catch (error) {
    console.error(err.message);
    res.status(500);
  }
});

// PARTNER
router.post("/partner/login", validInfo, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM partners WHERE email = $1", [
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

module.exports = router;
