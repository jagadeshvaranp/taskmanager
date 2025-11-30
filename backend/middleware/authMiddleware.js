const jwt = require("jsonwebtoken");
const User = require("../models/User");

//middleware is product only routs
//this file is use the middleware of authentication
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1]; // Extract actual token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next(); // Allow request to continue
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token failed", error: error.message });
  }
};


//middleware for admin-only to access

const adminonly = async (req, res) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(404).json({ message: "Access denied,admin only" });
  }
};


module.exports={protect,adminonly}