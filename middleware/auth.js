const jwt = require("jsonwebtoken");
const User = require("../models/user");

function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: "Token has expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = data;
      next();
    });
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = verifyJWT;