module.exports = function (req, res, next) {
  const {
    email,
    name,
    password,
    phoneNumber,
    companyName,
    companyPersonName,
    message,
  } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    if (![email, name, password, phoneNumber].every(Boolean)) {
      return res.status(403).json({ message: "Missing Credentials" });
    } else if (!validEmail(email)) {
      return res.status(401).json({ message: "Invalid Email" });
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(403).json({ message: "Missing Credentials" });
    } else if (!validEmail(email)) {
      return res.status(401).json({ message: "Invalid Email" });
    }
  } else if (req.path === "/partnerForm") {
    if (![companyName, companyPersonName, email, message].every(Boolean)) {
      return res.status(403).json({ message: "Missing required fields." });
    }
  }
  next();
};
