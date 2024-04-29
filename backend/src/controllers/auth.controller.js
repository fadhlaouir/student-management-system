/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
// Models
const User = require('../models/user.model');

// Token
const jwt = require('jsonwebtoken');

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */
/**
 * Sign up a new user
 * @param {Object} req - Request object containing user data
 * @param {Object} res - Response object to send JSON response
 */
const register = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      speciality,
      phoneNumber,
    } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: 'Please provide your email and password',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const newUser = new User({
      email,
      password,
      role,
      firstName,
      lastName,
      speciality,
      phoneNumber,
      file: req.files?.file ? req.files.file[0].path.replace('\\', '/') : '',
      joined_at: new Date(),
    });

    await newUser.save();

    return res.json({
      success: true,
      message: 'User registered successfully. You can now sign in',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while registering the user',
      error: error.message,
    });
  }
};

/**
 * Sign in with an existing account
 * @param {Object} req - Request object containing user credentials
 * @param {Object} res - Response object to send JSON response
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email }).populate('company');

    if (!foundUser || !foundUser.comparePassword(password)) {
      return res.status(403).json({
        success: false,
        message: 'Authentication failed. Incorrect email or password',
      });
    }

    const token = jwt.sign(foundUser.toJSON(), process.env.SECRET, {
      expiresIn: '7d',
    });

    return res.json({
      success: true,
      token,
      user: foundUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred during authentication',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
