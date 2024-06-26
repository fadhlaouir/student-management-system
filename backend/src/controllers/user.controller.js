/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
const User = require('../models/user.model');

/* -------------------------------------------------------------------------- */
/*                               User Controller                              */
/* -------------------------------------------------------------------------- */

/**
 * Retrieves the current user object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getCurrentUser = async (req, res) => {
  try {
    const foundUser = await User.findById(req.decoded._id);
    res
      .status(foundUser ? 200 : 404)
      .json({ success: !!foundUser, user: foundUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Retrieves a user by ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getUserById = async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);
    res
      .status(foundUser ? 200 : 404)
      .json({ success: !!foundUser, user: foundUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update a user by ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    // let foundUser = await User.findById(id);

    const updateFile = {};
    const updateCV = {};
    if (req.files?.file) {
      updateFile.file = req.files.file[0].path.replace('\\', '/');
    }
    if (req.files?.cv) {
      updateCV.cv = req.files.cv[0].path.replace('\\', '/');
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...updateFile,
        ...updateCV,
        ...req.body,
        updated_at: Date.now(),
      },
      { new: true },
    );

    res.status(updatedUser ? 200 : 404).json({
      success: !!updatedUser,
      message: updatedUser ? 'User updated successfully' : 'User not found',
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Retrieves all users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('company');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Deletes a user by ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(deletedUser ? 200 : 404).json({
      success: !!deletedUser,
      message: deletedUser ? 'User deleted successfully' : 'User not found',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCurrentUser,
  getUserById,
  updateUserById,
  getAllUsers,
  deleteUser,
};
