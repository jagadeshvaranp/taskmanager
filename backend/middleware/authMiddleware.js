const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes (Authentication)
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      
      const secret = process.env.JWT_SECRET; 

      if (!secret) {
        return res.status(500).json({ message: "Server configuration error: Secret not found" });
      }

      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token failed", error: error.message });
  }
};

// Middleware for admin-only access (Authorization)
const adminonly = (req, res, next) => { // Added 'next' here!
  // Checks if user exists and if their role is admin
  if (req.user && req.user.role === "admin") {
    next(); // Gate opens, request goes to Controller
  } else {
    // Usually, 403 Forbidden is better than 404 here
    res.status(403).json({ message: "Access denied, admin only" });
  }
};

module.exports = { protect, adminonly };