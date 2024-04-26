/* -------------------------------------------------------------------------- */
/*                                DEPENDENCIES                                */
/* -------------------------------------------------------------------------- */
// packages
const mongoose = require('mongoose');

/* -------------------------------------------------------------------------- */
/*                              SCHEMA DEFINITION                             */
/* -------------------------------------------------------------------------- */

/**
 * Schema definition for Ticket.
 * This schema defines the structure of the Ticket entity in the database.
 */
const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo',
  },
});

/**
 * Schema definition for Advancement.
 * This schema defines the structure of the Advancement entity in the database.
 */
const AdvancementSchema = new mongoose.Schema({
  tickets: [TicketSchema], // An Advancement can contain many tickets
  intern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true,
  },
});

/**
 * Model for Advancement.
 * This model represents the Advancement entity in the database.
 */
module.exports = mongoose.model('Advancement', AdvancementSchema);
