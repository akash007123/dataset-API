const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/auth");
const router = express.Router();

// Clear database route (for testing)
router.delete("/clear", async (req, res) => {
  try {
    await User.deleteMany({});
    console.log('Database cleared');
    res.json({ message: "Database cleared successfully" });
  } catch (error) {
    console.error('Error clearing database:', error);
    res.status(500).json({ message: "Error clearing database", details: error.message });
  }
});

// Check existing users route
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    console.log('Current users in database:', users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: "Error fetching users", details: error.message });
  }
});

// Signup route
router.post("/signup", async (req, res) => {
  try {
    console.log("Signup request body:", req.body); // Debugging
    const { username, password, firstName, lastName, email, gender } = req.body;

    // Validate input
    if (!username || !password || !firstName || !lastName || !email || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Create a new user
    const user = new User({ username, password, firstName, lastName, email, gender });
    await user.save();

    res.status(201).json({ message: "New user registered successfully" });
  } catch (error) {
    console.error("Signup error details:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    res.status(500).json({ message: "Internal server error", details: error.message });
  }
});


// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
});

module.exports = router;