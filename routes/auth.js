const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecretkey"; // production: use .env

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const allowedEmail = "rpd@gmail.com";

    // Step 1: Only allow this one email (case-insensitive, no spaces)
    if (email.toLowerCase().trim() !== allowedEmail.toLowerCase()) {
      return res.status(403).json({ message: "Access denied: unauthorized email" });
    }

    // Step 2: Find user
    const user = await User.findOne({ email: allowedEmail });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Step 3: Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Step 4: Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Step 5: Send success response
    res.json({
      message: "Admin login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
