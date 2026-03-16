const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const payload = {
    user: {
      id: userId
    }
  };
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    user = new User({
      email,
      password
    });

    await user.save();

    const token = generateToken(user.id);
    res.status(201).json({ token });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
