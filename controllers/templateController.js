const QRCode = require('qrcode');
const dataStore = {}; // In-memory store for generated templates
const port=3003;
// Function to generate a new vCard link and QR code
exports.generateLink = async (req, res) => {
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
    const qrCodeBase64 = await QRCode.toDataURL(publicLink);
    res.json({ publicLink, qrCodeBase64 });
  } catch (err) {
    res.status(500).json({ message: 'Error generating QR code' });
  }
};

// Function to render the template
exports.renderTemplate = async (req, res) => {
  const name = decodeURIComponent(req.params.name).replace(/-/g, ' ').toLowerCase();
  const data = dataStore[name];

  if (!data) {
    return res.status(404).send('Template not found');
  }

  const profileImageUrl = data.profileImage ? `http://localhost:${port}${data.profileImage}` : '#';
  const coverImageUrl = data.coverImage ? `http://localhost:${port}${data.coverImage}` : '#';

  try {
    const qrCodeBase64 = await QRCode.toDataURL(req.protocol + '://' + req.get('host') + req.originalUrl);

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <!-- Add your head content here -->
      </head>
      <body>
        <div class="container">
          <img src="${coverImageUrl}" alt="Cover Image" class="cover-image" />
          <img src="${profileImageUrl}" alt="Profile Image" class="profile-image" />
          <div class="name-container">
            <div class="name">${name}</div>
            <div class="profession">${data.profession || 'Not provided'}</div>
            <div class="about-me">${data.aboutMe || 'Not provided'}</div>
          </div>
          <div class="contact-info">
            <h2>Contact</h2>
            <div><i class="fas fa-envelope"></i><strong>Email:</strong> ${data.email || 'Not provided'}</div>
            <div><i class="fas fa-mobile-alt"></i><strong>Mobile:</strong> ${data.mobile || 'Not provided'}</div>
            <div><i class="fas fa-map-marker-alt"></i><strong>Location:</strong> ${data.location || 'Not provided'}</div>
            <div><i class="fas fa-calendar-alt"></i><strong>Appointment Date:</strong> ${data.appointmentDate || 'Not provided'}</div>
            <div><i class="fas fa-clock"></i><strong>Available Hours:</strong> ${data.availableHours || 'Not provided'}</div>
          </div>
          <div class="social-icons">
            <i class="fab fa-facebook"></i>
            <i class="fab fa-instagram"></i>
            <i class="fab fa-linkedin"></i>
            <i class="fab fa-twitter"></i>
          </div>
          <div class="footer">
            <strong>Appointment Details:</strong>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Error generating template');
  }
};
