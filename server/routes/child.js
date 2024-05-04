const express = require("express");
const router = express.Router();
const pool = require("../db");

// router.post("/add-child", authorization, async (req, res) => {
router.post("/add-child", async (req, res) => {
  try {
    const { name, age, gender, parent_id } = req.body;
    const newChild = await pool.query(
      `
            INSERT INTO child (parent_id, child, age, gender) VALUES ($1, $2, $3, $4) RETURNING *
          `,
      [name, age, gender, parent_id]
    );

    res.json(newChild.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
