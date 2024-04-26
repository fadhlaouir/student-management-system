/* -------------------------------------------------------------------------- */
/*                                DEPENDENCIES                                */
/* -------------------------------------------------------------------------- */
// packages
const express = require('express');
const router = express.Router();

// local controllers
const InternshipRequestController = require('../controllers/internshipRequest.controller');

/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */

// POST - Create a new InternshipRequest
router.post(
  '/internshipRequest',
  InternshipRequestController.createInternshipRequest,
);
// GET - Retrieve all internshipRequests
router.get(
  '/internshipRequests',
  InternshipRequestController.getAllInternshipRequest,
);

// GET - Retrieve internshipRequests by id
router.get(
  '/internshipRequests/:id',
  InternshipRequestController.getInternshipRequestById,
);

// PUT - Update a InternshipRequest by ID
router.put(
  '/internshipRequests/:id',
  InternshipRequestController.updateInternshipRequest,
);

// DELETE - Delete a InternshipRequest by ID
router.delete(
  '/internshipRequests/:id',
  InternshipRequestController.deleteInternshipRequest,
);

// Export the router
module.exports = router;
