const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Create a new user
    const newUser = new User({ username });
    await newUser.setPassword(password);
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// User login
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  try {
    // Generate JWT upon successful login
    const token = jwt.sign({ userId: req.user._id }, process.env.SECRET_KEY, { expiresIn: '30d' });
    
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;