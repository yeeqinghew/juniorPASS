const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");

// create a user
router.post("/register", validInfo, async (req, res) => {
  const { userType, name, phoneNumber, email, password, method, createdOn } =
    req.body;

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
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptedPassword = bcrypt.hashSync(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users(name, user_type, email, password, phone_number, method, created_on) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, userType, email, bcryptedPassword, phoneNumber, method, createdOn]
    );

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
      email.trim(),
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });
  } catch (error) {
    console.error(error);
  }
});

// get all users
router.get("/", async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users");
    res.json(user.rows);
  } catch (error) {
    console.error(err.message);
    res.status(500);
  }
});
module.exports = router;
