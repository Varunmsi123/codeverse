const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  console.log("\n=====================");
  console.log("AUTH MIDDLEWARE HIT");

  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    console.log("❌ No Authorization header found");
    return res.status(401).json({ message: "Missing header" });
  }

  let token = authHeader.split(" ")[1]?.trim();
  console.log("Extracted Token:", token);

  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    req.user = decoded.id;
    console.log("User set in req.user:", req.user);

    console.log("TOKEN VALID ✓");
    console.log("=====================\n");

    next();
  } catch (error) {
    console.log("JWT VERIFY ERROR:", error.message);
    console.log("=====================\n");
    return res.status(401).json({ message: "Invalid token" });
  }
};
