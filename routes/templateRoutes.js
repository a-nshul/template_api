const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Route to create a new template
router.post('/generate-link', upload.fields([{ name: 'profileImage' }, { name: 'coverImage' }]), templateController.generateTemplate);

// Route to get the template by its ID
router.get('/template/:id', templateController.getTemplateByNumber);

module.exports = router;
