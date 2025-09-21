const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple validation
    if (!username || !password) {
      return res.status(400).send({ message: 'Please provide a username and password.' });
    }

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).send({ message: 'User already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    user = new User({ username, password: hashedPassword });
    await user.save();

    // Send a success response (don't send back the user object with the hash)
    res.status(201).send({ message: 'User registered successfully.' });

  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple validation
    if (!username || !password) {
      return res.status(400).send({ message: 'Please provide a username and password.' });
    }

    // Check for user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ message: 'Invalid credentials.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid credentials.' });
    }

    // User matched, create JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        // Sending token and username back to the client
        res.json({ 
          token,
          user: {
            id: user.id,
            username: user.username,
          }
        });
      }
    );

  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

module.exports = router;