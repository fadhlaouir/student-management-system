/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

/* -------------------------------------------------------------------------- */
/*                                Disk Storage                                */
/* -------------------------------------------------------------------------- */

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(path.join(__dirname, '../../uploads/'))) {
      execSync(`mkdir "${path.join(__dirname, '../../uploads/')}"`);
    }
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname),
    );
  },
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    if (ext !== '.docx' && ext !== '.pdf') {
      return cb(new Error('Only Word (.docx) or PDF files are allowed'));
    }
    cb(null, true);
  },
});

/* ---------------------------------- CONST --------------------------------- */
const upload = multer({ storage: storage });
const fileUpload = upload.fields([{ name: 'file', maxCount: 1 }]);

// Multer config
module.exports = { fileUpload };
