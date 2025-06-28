const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");
const etagMiddleware = require("../middleware/etagMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");
const client = require("../utils/redisClient");
const validInfo = require("../middleware/validInfo");
const sendEmail = require("../utils/emailSender");
const {
  resetPasswordHtmlTemplate,
} = require("../utils/resetPasswordHtmlTemplate");

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

    // Get existing outlets tied to this partner
    const existingOutlets = await pool.query(
      `SELECT * FROM outlets WHERE partner_id = $1`,
      [id]
    );
    const existingOutletMap = new Map(
      existingOutlets.rows.map((o) => [o.address, o.outlet_id])
    );

    // Update existing outlets
    const updateQueries = outlets
      .filter((outlet) => existingOutletMap.has(outlet.outlet_id))
      .map(({ outlet_id, address, nearest_mrt }) =>
        pool.query(
          `UPDATE outlets SET address = $1, nearest_mrt = $2 WHERE outlet_id = $3`,
          [address, nearest_mrt, outlet_id]
        )
      );

    // Insert new outlets only if they don't exist
    const insertOutletQueries = outlets
      .filter((outlet) => !existingOutletMap.has(outlet.address)) // new outlets
      .map(async ({ address, nearest_mrt }) => {
        const result = await pool.query(
          `INSERT INTO outlets (partner_id, address, nearest_mrt) 
          VALUES ($1, $2, $3) RETURNING outlet_id`,
          [id, address, nearest_mrt]
        );
        return result.rows[0].outlet_id; // Get newly inserted outlet_id
      });

    await Promise.all([...updateQueries, ...insertOutletQueries]);

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

router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      `SELECT partner_id FROM partners WHERE LOWER(email) = LOWER($1)`,
      [email.trim()]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Email not registered." });
    }

    return res.status(200).json({ message: "Email valid." });
  } catch (err) {
    console.error("Error checking partner email:", err);
    return res.status(500).json({ error: "Server error." });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const partnerRes = await pool.query(
      `SELECT partner_id FROM partners WHERE LOWER(email) = LOWER($1)`,
      [email.trim()]
    );
    if (partnerRes.rowCount === 0) {
      return res.status(200).json({ message: "Password reset email sent." });
    }
    const partner_id = partnerRes.rows[0].partner_id;
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(token, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `INSERT INTO partnerPasswordResets (partner_id, token, expires_at) VALUES ($1, $2, $3)`,
      [partner_id, hashedToken, expiresAt]
    );

    const baseUrl = process.env.PARTNER_WEB_BASE_URL || "http://localhost:3000";
    const resetURL = `${baseUrl}/reset-password?token=${hashedToken}`;
    const emailContent = resetPasswordHtmlTemplate(resetURL);

    await sendEmail(email, "Password Reset Request", emailContent);
    res.status(200).json({ message: "Password reset email sent." });
  } catch (err) {
    console.error("Error in /partners/forgot-password", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const resetResult = await pool.query(
      `SELECT partner_id, expires_at FROM partnerPasswordResets WHERE token = $1`,
      [token]
    );

    if (resetResult.rows.length === 0)
      return res.status(400).json({ message: "Invalid or expired token" });

    const { partner_id, expires_at } = resetResult.rows[0];

    if (new Date() > new Date(expires_at)) {
      return res.status(400).json({ message: "Token expired" });
    }

    const saltRound = 10;
    const bcryptedPassword = bcrypt.hashSync(newPassword, saltRound);

    await pool.query(
      `UPDATE partners SET password = $1 WHERE partner_id = $2`,
      [bcryptedPassword, partner_id]
    );

    await pool.query(
      `DELETE FROM partnerPasswordResets WHERE partner_id = $1`,
      [partner_id]
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error in reset-password route:", err.message);
    res.status(500).json({ error: err.message });
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
