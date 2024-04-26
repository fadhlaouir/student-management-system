/* -------------------------------------------------------------------------- */
/*                                DEPENDENCIES                                */
/* -------------------------------------------------------------------------- */
// packages
const express = require('express');
const router = express.Router();

// local controllers
const AdvancementController = require('../controllers/advancement.controller');

/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */
/**
 * Routes for advancement CRUD operations.
 */

// POST - Create a new advancement
router.post('/advancement', AdvancementController.createAdvancement);

// GET - Get all advancements
router.get('/advancements', AdvancementController.getAllAdvancements);

// GET - Get a single advancement by ID
router.get('/advancements/:id', AdvancementController.getAdvancementById);

// PUT - Update a advancement by ID
router.put('/advancements/:id', AdvancementController.updateAdvancementById);

// DELETE - Delete a advancement by ID
router.delete('/advancements/:id', AdvancementController.deleteAdvancementById);

// Export the router
module.exports = router;
