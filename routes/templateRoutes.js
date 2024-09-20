const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const templateController = require('../controllers/templateController');

// Route to generate a new vCard link and QR code
router.post('/generate-link', upload.fields([{ name: 'profileImage' }, { name: 'coverImage' }]), templateController.generateLink);

// Route to render the template
router.get('/template/:name', templateController.renderTemplate);

module.exports = router;
