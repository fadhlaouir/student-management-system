/* -------------------------------------------------------------------------- */
/*                                DEPENDENCIES                                */
/* -------------------------------------------------------------------------- */
// packages
const mongoose = require('mongoose');

/* -------------------------------------------------------------------------- */
/*                              SCHEMA DEFINITION                             */
/* -------------------------------------------------------------------------- */
/**
 * Schema definition for IntenshipRequest.
 * This schema defines the structure of the IntenshipRequest entity in the database.
 */
const IntenshipRequestSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  intern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
  },
});

/**
 * Model for IntenshipRequest.
 * This model represents the IntenshipRequest entity in the database and provides
 * methods for interacting with IntenshipRequest documents.
 */
module.exports = mongoose.model('IntenshipRequest', IntenshipRequestSchema);
