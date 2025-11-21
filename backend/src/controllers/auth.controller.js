const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Simple token generation (for development - use JWT in production)
const generateToken = (userId) => {
  return `token_${userId}_${Date.now()}`;
};

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  // Create user (in production, hash the password with bcrypt)
  const user = await User.create({
    name,
    email,
    password, // In production, hash this: password: await bcrypt.hash(password, 10)
  });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Check password (in production, use bcrypt.compare)
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Generate token
  const token = generateToken(user._id);

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  // In production, verify token and get user from token
  // For now, return a simple response
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract user ID from token (simple implementation)
  const userId = token.split('_')[1];
  const user = await User.findById(userId);

  if (!user) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
});

exports.logout = asyncHandler(async (req, res) => {
  // In production, invalidate token
  res.json({ message: 'Logout successful' });
});

