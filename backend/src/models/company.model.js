/* -------------------------------------------------------------------------- */
/*                                DEPENDENCIES                                */
/* -------------------------------------------------------------------------- */
// packages
const mongoose = require('mongoose');

/* -------------------------------------------------------------------------- */
/*                              SCHEMA DEFINITION                             */
/* -------------------------------------------------------------------------- */
const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: String,
  phoneNumber: String,
  faxNumber: String,
  email: String,
});

module.exports = mongoose.model('Company', CompanySchema);
