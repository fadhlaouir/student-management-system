/* -------------------------------------------------------------------------- */
/*                                DEPENDENCIES                                */
/* -------------------------------------------------------------------------- */
// local models
const Internship = require('../models/internship.model');

/* -------------------------------------------------------------------------- */
/*                            CONTROLLER FUNCTIONS                            */
/* -------------------------------------------------------------------------- */
/**
 * Create a new internship.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function createInternship(req, res) {
  try {
    const newInternship = await Internship.create(req.body);
    res.status(201).json(newInternship);
  } catch (error) {
    console.error('Error creating internship:', error);
    res.status(500).json({ error: 'Failed to create internship' });
  }
}

/**
 * Get all internships.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function getInternships(req, res) {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (error) {
    console.error('Error getting internships:', error);
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
}

/**
 * Get a single internship by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function getInternshipById(req, res) {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ error: 'internship not found' });
    }
    res.json(internship);
  } catch (error) {
    console.error('Error getting internship by ID:', error);
    res.status(500).json({ error: 'Failed to fetch internship' });
  }
}

/**
 * Update a internship by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function updateInternship(req, res) {
  try {
    const updatedInternship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedInternship) {
      return res.status(404).json({ error: 'internship not found' });
    }
    res.json(updatedInternship);
  } catch (error) {
    console.error('Error updating internship by ID:', error);
    res.status(500).json({ error: 'Failed to update internship' });
  }
}

/**
 * Delete a internship by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function deleteInternship(req, res) {
  try {
    const deletedInternship = await Internship.findByIdAndDelete(req.params.id);
    if (!deletedInternship) {
      return res.status(404).json({ error: 'internship not found' });
    }
    res.json({ message: 'internship deleted successfully' });
  } catch (error) {
    console.error('Error deleting internship by ID:', error);
    res.status(500).json({ error: 'Failed to delete internship' });
  }
}

module.exports = {
  createInternship,
  getInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
};
