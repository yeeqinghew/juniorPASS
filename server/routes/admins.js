const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const etagMiddleware = require("../middleware/etagMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");

router.use(etagMiddleware);

// ADMIN
router.post("/login", cacheMiddleware, async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await pool.query("SELECT * FROM admins WHERE username = $1", [
      username,
    ]);

    if (admin.rows.length === 0) {
      return res.status(401).json({ message: "Invalid Credential" });
    }

    const validPassword = await bcrypt.compare(
      password,
      admin.rows[0].password
    );

    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Password or Email is incorrect" });
    }

    const token = jwtGenerator(admin.rows[0].admin_id);
    return res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// USERS
router.get("/getAllUsers", cacheMiddleware, async (req, res) => {
  // TODO: use middleware to check if user is superadmin
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    return res.status(200).json(allUsers.rows);
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
