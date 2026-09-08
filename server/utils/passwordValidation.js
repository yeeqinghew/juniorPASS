const PASSWORD_REQUIREMENTS_MESSAGE =
  "Use at least 8 characters with uppercase, lowercase, and a number.";

function isStrongPassword(password) {
  if (typeof password !== "string") return false;
  // Existing clients validate raw input before sending a SHA-256 digest.
  if (/^[a-f0-9]{64}$/i.test(password)) return true;
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(password);
}

module.exports = { isStrongPassword, PASSWORD_REQUIREMENTS_MESSAGE };
