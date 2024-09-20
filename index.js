const express = require('express');
const multer = require('multer');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3003;
const mongoose = require('mongoose');
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const mongoURI = 'mongodb://localhost:27017/template_api1';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));
const upload = multer({ storage });

// In-memory store for generated templates
const dataStore = {};
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to generate a new vCard link and QR code
app.post('/generate-link', upload.fields([{ name: 'profileImage' }, { name: 'coverImage' }]), async (req, res) => {
  const {
    name,
    profession,
    facebook,
    instagram,
    linkedin,
    whatsapp,
    aboutMe,
    email,
    mobile,
    location,
    appointmentDate,
    availableHours
  } = req.body;

  if (!name || !profession || !facebook || !instagram || !whatsapp || !aboutMe || !email || !mobile || !location || !appointmentDate || !availableHours) {
    return res.status(400).json({ message: 'All fields are required to generate the link' });
  }

  const profileImage = req.files && req.files.profileImage ? `/uploads/${req.files.profileImage[0].filename}` : null;
  const coverImage = req.files && req.files.coverImage ? `/uploads/${req.files.coverImage[0].filename}` : null;

  const normalizedName = name.toLowerCase();
  dataStore[normalizedName] = {
    profession,
    facebook,
    instagram,
    linkedin,
    whatsapp,
    aboutMe,
    email,
    mobile,
    location,
    appointmentDate,
    availableHours,
    profileImage,
    coverImage
  };

  const publicLink = `http://localhost:${port}/template/${encodeURIComponent(name.replace(/\s+/g, '-').toUpperCase())}`;

  try {
    // Generate QR code as a Base64 string
    const qrCodeBase64 = await QRCode.toDataURL(publicLink);
    res.json({ publicLink, qrCodeBase64 });
  } catch (err) {
    res.status(500).json({ message: 'Error generating QR code' });
  }
});

app.get('/template/:name', async (req, res) => {
  const name = decodeURIComponent(req.params.name).replace(/-/g, ' ').toLowerCase();
  const data = dataStore[name];

  if (!data) {
    return res.status(404).send('Template not found');
  }

  const profileImageUrl = data.profileImage ? `http://localhost:${port}${data.profileImage}` : '#';
  const coverImageUrl = data.coverImage ? `http://localhost:${port}${data.coverImage}` : '#';

  try {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume Template</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Segoe+UI:wght@400;700&display=swap">
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }

          .resume-template {
            width: 428px;
            background-color: #033637;
            border-radius: 16px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.5s ease-in-out;
            position: relative;
            display: flex;
            flex-direction: column;
          }

          .resume-template:hover {
            transform: scale(1.05);
          }

          .cover-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
            opacity: 0.9;
          }

          .profile-image {
            width: 110px;
            height: 110px;
            border-radius: 50%;
            border: 4px solid #fff;
            position: absolute;
            top: 180px;
            left: 30px;
            object-fit: cover;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          }

          .about-section {
            margin-top: 140px;
            padding: 20px;
            color: white;
            position: relative;
            z-index: 1;
          }

          .name {
            font-size: 28px;
            color: #C29843;
          }

          .profession {
            font-size: 18px;
            color: #CDECEE;
          }

          .about-me {
            margin-top: 10px;
            color: #c1e1e1;
            font-size: 14px;
          }

          .contact-section {
            padding: 20px;
            color: white;
          }

          .contact-grid {
            display: flex;
            flex-direction: column;
          }

          .contact-item {
            width: 100%;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 8px;
            display: flex;
            align-items: center;
          }

          .contact-item i {
            margin-right: 10px;
            color: gold; /* Change contact icon color to gold */
          }

          .social-links {
            display: flex;
            justify-content: center; /* Center the social links */
            margin-top: 20px; /* Add margin to the top */
            padding: 20px; /* Add padding for spacing */
          }

          .social-icon {
            font-size: 24px;
            color: gold; /* Change social icon color to silver */
            margin: 0 10px; /* Space between icons */
          }

          .appointment-footer {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
          }

          .border {
            width: 50px;
            height: 1px;
            background-color: #C29843;
            margin: 5px auto;
          }
        </style>
      </head>
      <body>
        <div class="resume-template">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbhgSe47Iwr20FTah4RCnutoUrsOeDN8id1A&s" alt="Cover Image" class="cover-image" />
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo3Xqrl4hFcEH_l8PCwaTk_AhAgql808_x_w&s" alt="Profile Image" class="profile-image" />
          
          <div class="about-section">
            <div class="name">${name}</div>
            <div class="profession">${data.profession}</div>
            <div class="about-me">${data.aboutMe}</div>
          </div>

          <div class="contact-section">
            <div class="contact-grid">
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <strong>Email:</strong> ${data.email}
              </div>
              <div class="contact-item">
                <i class="fas fa-phone"></i>
                <strong>Mobile:</strong> ${data.mobile}
              </div>
              <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <strong>Location:</strong> ${data.location}
              </div>
              <div class="contact-item">
                <i class="fas fa-calendar-alt"></i>
                <strong>Appointment Date:</strong> ${data.appointmentDate}
              </div>
              <div class="contact-item">
                <i class="fas fa-clock"></i>
                <strong>Available Hours:</strong> ${data.availableHours}
              </div>
            </div>
          </div>

          <div class="social-links">
            <a href="${data.facebook || '#'}"><i class="fab fa-facebook social-icon"></i></a>
            <a href="${data.instagram || '#'}"><i class="fab fa-instagram social-icon"></i></a>
            <a href="${data.linkedin || '#'}"><i class="fab fa-linkedin social-icon"></i></a>
            <a href="${data.whatsapp || '#'}"><i class="fab fa-whatsapp social-icon"></i></a>
          </div>

          <div class="appointment-footer">
            <div class="border"></div>
            <strong>Appointment Details</strong>
            <div class="border"></div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Error generating template');
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});