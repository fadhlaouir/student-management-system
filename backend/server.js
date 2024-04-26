/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
// Packages
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// config
dotenv.config();

// const
const app = express();

// DATABASE CONNECTION
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DEV_DATABASE, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to the database');
  }
});

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors());

const advancementRoutes = require('./src/routes/advancement.route');
app.use('/v1/api', advancementRoutes);

// Require APIs
const userRoutes = require('./src/routes/user.route');
const authRoutes = require('./src/routes/auth.route');
const internshipRoutes = require('./src/routes/internship.route');
const companyRoutes = require('./src/routes/company.route');
const internshipRequestRoutes = require('./src/routes/internshipRequest.route');

// local APIs
app.use('/v1/api', companyRoutes);
app.use('/v1/api', internshipRoutes);
app.use('/v1/api', authRoutes);
app.use('/v1/api', userRoutes);
app.use('/v1/api', internshipRequestRoutes);

// API for uploads file (photo, galleries)
app.get('/uploads/:id', (req, res) => {
  res.sendFile(path.join(__dirname, `./uploads/${req.params.id}`));
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening on PORT ${PORT}`);
  }
});

module.exports = app;
