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
    const {
      title,
      subject,
      startDate,
      endDate,
      status,
      company,
      supervisor,
      manager,
    } = req.body;

    // const newInternship = await Internship.create(req.body);
    const newInternship = new Internship({
      title,
      subject,
      startDate,
      endDate,
      status,
      company,
      supervisor,
      manager,
      file: req.files?.file ? req.files.file[0].path.replace('\\', '/') : '',
    });

    await newInternship.save();

    res.status(201).json({
      status: 'success',
      message: 'Internship created successfully',
      data: newInternship,
    });
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
    const internships = await Internship.find().populate('company supervisor');
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
    // Find the internship by ID
    let internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({
        status: 'fail',
        message: 'Internship not found',
      });
    }

    // Update the fields with values from the request body if they exist
    if (req.body.company) {
      internship.company = req.body.company;
    }
    if (req.body.intern) {
      internship.intern = req.body.intern;
    }
    if (req.body.supervisor) {
      internship.supervisor = req.body.supervisor;
    }

    // Update other fields if they exist in the request body
    if (req.body.title) {
      internship.title = req.body.title;
    }
    if (req.body.subject) {
      internship.subject = req.body.subject;
    }
    if (req.body.startDate) {
      internship.startDate = req.body.startDate;
    }
    if (req.body.endDate) {
      internship.endDate = req.body.endDate;
    }
    if (req.body.status) {
      internship.status = req.body.status;
    }
    if (req.files?.file) {
      internship.file = req.files.file[0].path.replace('\\', '/');
    }

    // Save the updated internship
    await internship.save();

    // Return success response
    res.status(200).json({
      status: 'success',
      data: internship,
    });
  } catch (err) {
    // Handle errors
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
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
