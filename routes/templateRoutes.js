// const express = require('express');
// const router = express.Router();
// const templateController = require('../controllers/templateController');
// const multer = require('multer');
// const path = require('path');

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, '/tmp'); // Use the temporary directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });

// // Route to create a new template
// router.post('/generate-link', upload.fields([{ name: 'profileImage' }, { name: 'coverImage' }]), templateController.generateTemplate);

// // Route to get the template by its ID
// router.get('/template/:id', templateController.getTemplateByNumber);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { generateTemplate, getTemplateByNumber } = require('../controllers/templateController');
const multer = require('multer');
const path = require('path');
// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp'); // Save files to /tmp
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid duplicate names
  }
});

const upload = multer({ storage });

router.post('/generate-link', upload.fields([{ name: 'profileImage' }, { name: 'coverImage' }]), generateTemplate);
router.get('/template/:id', getTemplateByNumber);

module.exports = router;
