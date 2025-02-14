const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Authorization Header:", authHeader); // Debug log

  const token = authHeader?.split(" ")[1];
  console.log("Extracted Token:", token); // Debug log

  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token Verification Error:", err); // Debug log
      return res.status(403).json({ message: "Invalid Token" });
    }
    console.log("Decoded User:", user); // Debug log
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
