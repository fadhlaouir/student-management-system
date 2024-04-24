/* -------------------------------------------------------------------------- */
/*                                DEPENDENCIES                                */
/* -------------------------------------------------------------------------- */
// local models
const Company = require('../models/company.model');

/* -------------------------------------------------------------------------- */
/*                            CONTROLLER FUNCTIONS                            */
/* -------------------------------------------------------------------------- */
/**
 * Create a new company.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function createCompany(req, res) {
  try {
    const newCompany = await Company.create(req.body);
    res.status(201).json(newCompany);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
}

/**
 * Get all companys.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function getCompanys(req, res) {
  try {
    const companys = await Company.find();
    res.json(companys);
  } catch (error) {
    console.error('Error getting companys:', error);
    res.status(500).json({ error: 'Failed to fetch companys' });
  }
}

/**
 * Get a single company by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function getCompanyById(req, res) {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error getting company by ID:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
}

/**
 * Update a company by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function updateCompany(req, res) {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedCompany) {
      return res.status(404).json({ error: 'company not found' });
    }
    res.json(updatedCompany);
  } catch (error) {
    console.error('Error updating company by ID:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
}

/**
 * Delete a company by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function deleteCompany(req, res) {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ error: 'company not found' });
    }
    res.json({ message: 'company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company by ID:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
}

module.exports = {
  createCompany,
  getCompanys,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
