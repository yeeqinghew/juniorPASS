const express = require("express");
const router = express.Router();
const pool = require("../db");
const generateS3UploadURL = require("../utils/s3.js");

router.get("/s3url", async (req, res) => {
  const url = await generateS3UploadURL();
  res.json({ url });
});

router.get("/getAllAgeGroups", async (req, res) => {
  try {
    const ageGroups = await pool.query("SELECT * FROM ageGroups");
    res.json(ageGroups.rows);
  } catch (error) {
    console.error("ERROR in /misc/getAllAgeGroups", error.message);
  }
});

router.get("/getAllPackages", async (req, res) => {
  try {
    const packageTypes = await pool.query("SELECT * FROM packageTypes");
    res.json(packageTypes.rows);
  } catch (error) {
    console.error("ERROR in /misc/getAllPackages", error.message);
  }
});

router.get("/getAllCategories", async (req, res) => {
  try {
    const categories = await pool.query("SELECT * FROM categoriesListings");
    res.json(categories.rows);
  } catch (error) {
    console.error("ERROR in /misc/getAllCategories", error.message);
  }
});

module.exports = router;
