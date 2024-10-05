const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const multer = require('multer');

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Adjusting the upload to require two files
router.post('/generate-link', 
    upload.fields([
      { name: 'profileImage' }, 
      { name: 'coverImage' }, 
      { name: 'galleryImages' }, 
      { name: 'productImages' }
    ]), 
    templateController.generateTemplate
  );
  
router.get('/template/:id', templateController.getTemplateByNumber);

module.exports = router;
