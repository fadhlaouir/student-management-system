/* -------------------------------------------------------------------------- */
/*                                DEPENDENCIES                                */
/* -------------------------------------------------------------------------- */
// Local models
const InternshipRequest = require('../models/internshipRequest.model');

/* -------------------------------------------------------------------------- */
/*                            CONTROLLER FUNCTIONS                            */
/* -------------------------------------------------------------------------- */

/**
 * Creates a new InternshipRequest.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the operation completion.
 */
async function createInternshipRequest(req, res) {
  try {
    // Create a new InternshipRequest instance with data from the request body
    const newRequest = new InternshipRequest(req.body);

    // Save the new InternshipRequest to the database
    await newRequest.save();
    // Send a success response
    res.status(201).json(newRequest);
  } catch (error) {
    // Send an error response if there's an error
    res.status(500).json({ error: error.message });
  }
}

/**
 * Retrieves all InternshipRequests from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function getAllInternshipRequest(req, res) {
  try {
    // Find all InternshipRequests
    const requests = await InternshipRequest.find()
      .populate('intern')
      .populate({
        path: 'internship',
        populate: [
          { path: 'company', model: 'Company' },
          { path: 'supervisor', model: 'User' }, // Assuming 'supervisor' is a direct reference to the User model
        ],
      });

    res.status(200).json(requests);
  } catch (error) {
    // Send an error response if there's an error
    res.status(500).json({ error: error.message });
  }
}

/**
 * Retrieves InternshipRequest by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the operation completion.
 */
async function getInternshipRequestById(req, res) {
  try {
    // Find the InternshipRequest by ID
    const request = await InternshipRequest.findById(req.params.id);
    // Send a response with the found InternshipRequest
    res.status(200).json(request);
  } catch (error) {
    // Send an error response if there's an error or if the InternshipRequest is not found
    res.status(404).json({ error: 'InternshipRequest not found' });
  }
}

/**
 * Updates an existing InternshipRequest by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the operation completion.
 */
async function updateInternshipRequest(req, res) {
  try {
    // Find the InternshipRequest by ID and update it with data from the request body
    const updatedRequest = await InternshipRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    // Send a response with the updated InternshipRequest
    res.status(200).json(updatedRequest);
  } catch (error) {
    // Send an error response if there's an error or if the InternshipRequest is not found
    res.status(404).json({ error: 'InternshipRequest not found' });
  }
}

/**
 * Deletes an existing InternshipRequest by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the operation completion.
 */
async function deleteInternshipRequest(req, res) {
  try {
    // Find the InternshipRequest by ID and delete it
    await InternshipRequest.findByIdAndDelete(req.params.id);
    // Send a success response
    res.status(204).send();
  } catch (error) {
    // Send an error response if there's an error or if the InternshipRequest is not found
    res.status(404).json({ error: 'InternshipRequest not found' });
  }
}

// Export controller functions
module.exports = {
  createInternshipRequest,
  getAllInternshipRequest,
  getInternshipRequestById,
  updateInternshipRequest,
  deleteInternshipRequest,
};
