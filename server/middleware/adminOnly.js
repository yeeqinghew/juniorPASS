const pool = require("../db");

/**
 * Requires prior authorization middleware to have set req.user.
 * Verifies that req.user corresponds to an admin_id in the admins table.
 */
module.exports = async (req, res, next) => {
  try {
    const adminId = req.user;
    if (!adminId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await pool.query(
      "SELECT admin_id FROM admins WHERE admin_id = $1",
      [adminId]
    );
    if (result.rowCount === 0) {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    next();
  } catch (err) {
    console.error("ERROR in adminOnly middleware:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};
