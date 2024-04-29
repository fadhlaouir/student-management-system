/* -------------------------------------------------------------------------- */
/*                                DEPENDENCIES                                */
/* -------------------------------------------------------------------------- */
// packages
const mongoose = require('mongoose');

/* -------------------------------------------------------------------------- */
/*                              SCHEMA DEFINITION                             */
/* -------------------------------------------------------------------------- */

const InternshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  startDate: String,
  endDate: String,
  status: {
    type: String,
    required: true,
    enum: ['open', 'closed'],
    default: 'open',
  },
  company: String,
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  file: String,
});

module.exports = mongoose.model('Internship', InternshipSchema);
