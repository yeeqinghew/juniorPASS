const express = require("express");
const router = express.Router();
const pool = require("../db");

// router.post("/add-child", authorization, async (req, res) => {
router.post("/addChild", async (req, res) => {
  const { name, age, gender, parent_id } = req.body;
  try {
    const newChild = await pool.query(
      `INSERT INTO children (name, age, gender, parent_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, age, gender, parent_id]
    );
    res.status(201).json({
      message: "Child has been created!",
      data: newChild,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/getChildrenByParent/:parent_id", async (req, res) => {
  const parent_id = req.params.parent_id;

  try {
    const children = await pool.query(
      "SELECT * FROM children WHERE parent_id = $1",
      [parent_id]
    );
    res.json(children.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
