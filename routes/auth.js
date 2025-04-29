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
    console.log("Signup request body:", req.body);
    const { username, password } = req.body;
    console.log('Attempting to sign up user:', username);
    
    // Validate input
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ message: "Username and password are required" });
    }

    if (username.length < 3) {
      console.log('Username too short:', username);
      return res.status(400).json({ message: "Username must be at least 3 characters long" });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    
    // Check if user already exists
    console.log('Checking for existing user:', username);
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Existing user found:', existingUser.username);
      return res.status(400).json({ message: "Username already exists" });
    }

    console.log('Creating new user:', username);
    const user = new User({ username, password });
    await user.save();
    console.log('New user created successfully:', username);
    res.status(201).json({ message: "New user registered successfully" });
  } catch (error) {
    console.error('Signup error details:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username already exists" });
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