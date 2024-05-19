const express = require("express");
const router = express.Router();
const pool = require("../db");
const generateS3UploadURL = require("../utils/s3.js");
const etagMiddleware = require("../middleware/etagMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");

router.use(etagMiddleware);

router.get("/s3url", async (req, res) => {
  const url = await generateS3UploadURL();
  res.json({ url });
});

router.get("/getAllAgeGroups", cacheMiddleware, async (req, res) => {
  try {
    const ageGroups = await pool.query("SELECT * FROM ageGroups");
    res.json(ageGroups.rows);
  } catch (error) {
    console.error("ERROR in /misc/getAllAgeGroups", error.message);
  }
});

router.get("/getAllPackages", cacheMiddleware, async (req, res) => {
  try {
    const packageTypes = await pool.query("SELECT * FROM packageTypes");
    res.json(packageTypes.rows);
  } catch (error) {
    console.error("ERROR in /misc/getAllPackages", error.message);
  }
});

router.get("/getAllCategories", cacheMiddleware, async (req, res) => {
  try {
    const categories = await pool.query("SELECT * FROM categoriesListings");
    res.json(categories.rows);
  } catch (error) {
    console.error("ERROR in /misc/getAllCategories", error.message);
  }
});

module.exports = router;
