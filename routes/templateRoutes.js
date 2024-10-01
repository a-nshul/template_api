// // const express = require('express');
// // const router = express.Router();
// // const templateController = require('../controllers/templateController');
// // const multer = require('multer');
// // const path = require('path');

// // // Configure multer for file uploads
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, path.join(__dirname, '../uploads'));
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, Date.now() + path.extname(file.originalname));
// //   },
// // });
// // const upload = multer({ storage });

// // // Route to create a new template
// // router.post('/generate-link', upload.fields([{ name: 'profileImage' }, { name: 'coverImage' }]), templateController.generateTemplate);

// // // Route to get the template by its ID
// // router.get('/template/:id', templateController.getTemplateByNumber);

// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const templateController = require('../controllers/templateController');
// const multer = require('multer');

// // Configure multer to store files in memory
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Adjusting the upload to require a single file
// router.post('/generate-link', upload.single('profileImage'), templateController.generateTemplate);

// router.get('/template/:id', templateController.getTemplateByNumber);

// module.exports = router;

const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const multer = require('multer');

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Adjusting the upload to require two files
router.post('/generate-link', upload.fields([{ name: 'profileImage' }, { name: 'coverImage' }]), templateController.generateTemplate);

router.get('/template/:id', templateController.getTemplateByNumber);

module.exports = router;
