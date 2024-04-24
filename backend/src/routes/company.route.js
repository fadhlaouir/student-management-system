/* -------------------------------------------------------------------------- */
/*                                DEPENDENCIES                                */
/* -------------------------------------------------------------------------- */
// packages
const express = require('express');
const router = express.Router();

// local controllers
const CompanyController = require('../controllers/company.controller');

/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */
/**
 * Routes for company CRUD operations.
 */

// POST - Create a new company
router.post('/company', CompanyController.createCompany);

// GET - Get all companys
router.get('/companys', CompanyController.getCompanys);

// GET - Get a single company by ID
router.get('/companys/:id', CompanyController.getCompanyById);

// PUT - Update a company by ID
router.put('/companys/:id', CompanyController.updateCompany);

// DELETE - Delete a company by ID
router.delete('/companys/:id', CompanyController.deleteCompany);

// Export the router
module.exports = router;
