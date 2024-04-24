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
});

module.exports = mongoose.model('Internship', InternshipSchema);
