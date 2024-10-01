// const express = require('express');
// const router = express.Router();
// const templateController = require('../controllers/templateController');
// const multer = require('multer');
// const path = require('path');

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../uploads'));
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
const templateController = require('../controllers/templateController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads (only profileImage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // 1MB file limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!'); 
    }
  },
});

router.post('/generate-link', upload.fields([{ name: 'profileImage', maxCount: 1 }]), templateController.generateTemplate);
router.get('/template/:id', templateController.getTemplateByNumber);

module.exports = router;
