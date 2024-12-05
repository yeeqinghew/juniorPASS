const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");
const etagMiddleware = require("../middleware/etagMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");
const client = require("../utils/redisClient");
const validInfo = require("../middleware/validInfo");

router.use(etagMiddleware);

// PARTNER
router.get("/", authorization, async (req, res) => {
  try {
    const partner = await pool.query(
      "SELECT * FROM partners WHERE partner_id = $1",
      [req.user]
    );
    return res.status(200).json(partner.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const partner = await pool.query(
      "SELECT * FROM partners WHERE email = $1",
      [email]
    );

    if (partner.rows.length === 0) {
      return res.status(401).json({ message: "Invalid Credential" });
    }

    const validPassword = await bcrypt.compare(
      password,
      partner.rows[0].password
    );
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Password or Email is incorrect" });
    }

    const token = jwtGenerator(partner.rows[0].partner_id);
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", cacheMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const [partner, listings, reviews] = await Promise.all([
      getPartnerByPartnerId(id),
      getListingsByPartnerId(id),
      getReviwesByPartnerId(id),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        partner,
        listings,
        reviews,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { partner_name, description, address, contact_number, website } =
      req.body;

    const updatedPartner = await pool.query(
      `UPDATE partners 
      SET
        partner_name = $1,
        description = $2,
        address = $3,
        contact_number = $4,
        website = $5
      WHERE partner_id = $6 RETURNING *`,
      [partner_name, description, address, contact_number, website, id]
    );
    await client.del(`/partners/${id}`);

    return res.status(200).json({
      message: "Information has been updated",
      partner: updatedPartner.rows[0],
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/partnerForm", validInfo, async (req, res) => {
  try {
    const { companyName, companyPersonName, email, message } = req.body;
    const request = await pool.query(
      `INSERT INTO partnerForms (
        company_name,
        contact_person_name,
        email,
        message
      )
      VALUES($1, $2, $3, $4)`,
      [companyName, companyPersonName, email, message]
    );
    res.status(201).json({
      message:
        "We've received your request. Our admin will contact you shortly.",
    });
  } catch (error) {
    console.error("ERROR in /misc/contactUs", error.message);
    res.status(500).json({ error: error.message });
  }
});

const getPartnerByPartnerId = async (partnerId) => {
  try {
    const partner = await pool.query(
      `SELECT partner_id,
        partner_name,
        email,
        password,
        description,
        website,
        rating,
        picture,
        address,
        region,
        contact_number,
        array_to_json(categories) AS categories,
        created_on 
      FROM partners WHERE partner_id = $1`,
      [partnerId]
    );
    return partner.rows[0];
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getListingsByPartnerId = async (partnerId) => {
  try {
    const listings = await pool.query(
      "SELECT * FROM listings WHERE partner_id = $1 ORDER BY created_on DESC",
      [partnerId]
    );
    return listings.rows;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getReviwesByPartnerId = async (partnerId) => {
  try {
    const reviews = await pool.query(
      "SELECT * FROM reviews WHERE partner_id = $1",
      [partnerId]
    );
    return reviews.rows;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = router;
