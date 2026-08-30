const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

const registerUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const error = new Error('Email is already registered');
    error.statusCode = 400;
    throw error;
  }

  const user = new User({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'operator',
  });

  await user.save();
  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    },
    token,
  };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
  };
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  generateToken,
};
