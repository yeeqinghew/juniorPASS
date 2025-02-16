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
const sendEmail = require("../utils/emailSender");

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

router.get("/:partnerId/outlets", authorization, async (req, res) => {
  const { partnerId } = req.params;

  try {
    // Query to get outlets for the specific partner
    const outlets = await pool.query(
      "SELECT * FROM outlets WHERE partner_id = $1",
      [partnerId]
    );
    return res.status(200).json(outlets.rows);
  } catch (error) {
    console.error(error.message);
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
    const {
      partner_name,
      description,
      address,
      contact_number,
      website,
      outlets,
    } = req.body;

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

    // update outlets (UPDATE, ADD New, DELETE removed)
    const existingOutlets = await pool.query(
      `SELECT * FROM outlets WHERE partner_id = $1`,
      [id]
    );

    const existingOutletIds = new Set(
      existingOutlets.rows.map((o) => o.outlet_id)
    );
    const newOutletIds = new Set(
      outlets.map((o) => o.outlet_id).filter((id) => id)
    );

    const updateQueries = outlets
      .filter((outlet) => existingOutletIds.has(outlet.id))
      .map(({ id, address, nearest_mrt }) =>
        pool.query(
          `UPDATE outlets SET outlet_address = $1, nearest_mrt = $2 WHERE outlet_id = $3`,
          [address, nearest_mrt, id]
        )
      );

    const insertQueries = outlets
      .filter((outlet) => !outlet.id) // new outlets
      .map(({ address, nearest_mrt }) =>
        pool.query(
          `INSERT INTO outlets (partner_id, address, nearest_mrt) VALUES ($1, $2, $3)`,
          [id, address, nearest_mrt]
        )
      );

    const deleteQueries = [...existingOutletIds]
      .filter((id) => !newOutletIds.has(id))
      .map((id) =>
        pool.query(`DELETE FROM outlets WHERE outlet_id = $1`, [id])
      );

    await Promise.all([...updateQueries, ...insertQueries, ...deleteQueries]);

    return res.status(200).json({
      message: "Information has been updated successfully!",
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

    // send email notification to admin
    await sendEmail(
      "admin@juniorpass.sg",
      "New Partner Enquiry",
      `
      <p>A new partner has submitted a request.</p>
      <p><strong>Company:</strong> ${companyName}</p>
      <p><strong>Contact Person:</strong> ${companyPersonName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      `
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
    console.error("ERROR in getPartnerByPartnerId:", error.message);
    throw error;
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
    console.error("ERROR in getPartnerByPartnerId:", error.message);
    throw error;
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
    console.error("ERROR in getPartnerByPartnerId:", error.message);
    throw error;
  }
};

module.exports = router;
