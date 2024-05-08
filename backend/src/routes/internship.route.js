/* -------------------------------------------------------------------------- */
/*                                DEPENDENCIES                                */
/* -------------------------------------------------------------------------- */
// packages
const express = require('express');
const router = express.Router();

// local controllers
const InternshipController = require('../controllers/internship.controller');
const verifyToken = require('../middlewares/verify-token');
const { fileUpload } = require('../middlewares/multer');

/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */
/**
 * Routes for internship CRUD operations.
 */

// POST - Create a new internship
router.post(
  '/internship',
  verifyToken,
  fileUpload,
  InternshipController.createInternship,
);

// GET - Get all internships
router.get('/internships', InternshipController.getInternships);

// GET - Get a single internship by ID
router.get('/internships/:id', InternshipController.getInternshipById);

// PUT - Update a internship by ID
router.put(
  '/internships/:id',
  verifyToken,
  fileUpload,
  InternshipController.updateInternship,
);

// DELETE - Delete a internship by ID
router.delete(
  '/internships/:id',
  verifyToken,
  InternshipController.deleteInternship,
);

// Export the router
module.exports = router;
