// const QRCode = require('qrcode');
// const Template = require('../models/Template');

// // In-memory stores
// const dataStore = {};
// const nameStore = {};

// // Generate a new template and QR code
// const generateTemplate = async (req, res) => {
//   try {
//     const {
//       name, profession, facebook, instagram, linkedin, whatsapp, aboutMe, email,
//       mobile, location, appointmentDate, availableHours
//     } = req.body;

//     if (!name || !profession || !facebook || !instagram || !whatsapp || !aboutMe || !email || !mobile || !location || !appointmentDate || !availableHours) {
//       return res.status(400).json({ message: 'All fields are required to generate the link' });
//     }

//     const profileImage = req.files && req.files.profileImage ? `/uploads/${req.files.profileImage[0].filename}` : null;
//     const coverImage = req.files && req.files.coverImage ? `/uploads/${req.files.coverImage[0].filename}` : null;

//     // Save the template data in MongoDB
//     const template = new Template({
//       name, profession, facebook, instagram, linkedin, whatsapp, aboutMe, email,
//       mobile, location, appointmentDate, availableHours, profileImage, coverImage
//     });
//     await template.save();

//     // Use the template's _id to generate the public link
//     const publicLink = `http://localhost:3003/template/${template._id}`;
//     const qrCodeBase64 = await QRCode.toDataURL(publicLink);

//     // Store the data in memory (if needed, this can be removed if not required)
//     dataStore[template._id] = {
//       profession, facebook, instagram, linkedin, whatsapp, aboutMe, email, mobile,
//       location, appointmentDate, availableHours, profileImage, coverImage,
//     };

//     nameStore[template._id] = name.toLowerCase();

//     res.json({ publicLink, qrCodeBase64 });
//   } catch (err) {
//     console.log({message: err.message});
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Fetch the generated template using the unique template ID
// const getTemplateByNumber = (req, res) => {
//   const id = req.params.id; // Change this line to read ID instead of number
//   const data = dataStore[id];

//   if (!data) {
//     return res.status(404).send('Template not found');
//   }

//   const name = nameStore[id];
//   const profileImageUrl = data.profileImage ? `http://localhost:3003${data.profileImage}` : '#';
//   const coverImageUrl = data.coverImage ? `http://localhost:3003${data.coverImage}` : '#';

//   try {
//     res.send(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Resume Template</title>
//         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
//         <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Segoe+UI:wght@400;700&display=swap">
//          <style>
//           body {
//             font-family: 'Segoe UI', sans-serif;
//             background-color: #f4f4f4;
//             margin: 0;
//             padding: 0;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             min-height: 100vh;
//           }

//           .resume-template {
//             width: 428px;
//             background-color: #033637;
//             border-radius: 16px;
//             box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
//             overflow: hidden;
//             transition: transform 0.5s ease-in-out;
//             position: relative;
//             display: flex;
//             flex-direction: column;
//           }

//           .resume-template:hover {
//             transform: scale(1.05);
//           }

//           .cover-image {
//             width: 100%;
//             height: 250px;
//             object-fit: cover;
//             opacity: 0.9;
//           }

//           .profile-image {
//             width: 110px;
//             height: 110px;
//             border-radius: 50%;
//             border: 4px solid #fff;
//             position: absolute;
//             top: 180px;
//             left: 30px;
//             object-fit: cover;
//             box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
//           }

//           .about-section {
//             margin-top: 140px;
//             padding: 20px;
//             color: white;
//             position: relative;
//             z-index: 1;
//           }

//           .name {
//             font-size: 28px;
//             color: #C29843;
//           }

//           .profession {
//             font-size: 18px;
//             color: #CDECEE;
//           }

//           .about-me {
//             margin-top: 10px;
//             color: #c1e1e1;
//             font-size: 14px;
//           }

//           .contact-section {
//             padding: 20px;
//             color: white;
//           }

//           .contact-grid {
//             display: flex;
//             flex-direction: column;
//           }

//           .contact-item {
//             width: 100%;
//             margin-bottom: 10px;
//             padding: 10px;
//             border-radius: 8px;
//             display: flex;
//             align-items: center;
//           }

//           .contact-item i {
//             margin-right: 10px;
//             color: gold;
//           }

//           .social-links {
//             display: flex;
//             justify-content: center;
//             margin-top: 20px;
//             padding: 20px;
//           }

//           .social-icon {
//             font-size: 24px;
//             color: gold;
//             margin: 0 10px;
//           }

//           .appointment-footer {
//             margin-top: 20px;
//             text-align: center;
//             font-size: 14px;
//           }

//           .border {
//             width: 50px;
//             height: 1px;
//             background-color: #C29843;
//             margin: 5px auto;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="resume-template">
//           <img src="${coverImageUrl}" alt="Cover Image" class="cover-image" />
//           <img src="${profileImageUrl}" alt="Profile Image" class="profile-image" />
          
//           <div class="about-section">
//             <div class="name">${name}</div>
//             <div class="profession">${data.profession}</div>
//             <div class="about-me">${data.aboutMe}</div>
//           </div>

//           <div class="contact-section">
//             <div class="contact-grid">
//               <div class="contact-item">
//                 <i class="fas fa-envelope"></i>
//                 <strong>Email:</strong> ${data.email}
//               </div>
//               <div class="contact-item">
//                 <i class="fas fa-phone"></i>
//                 <strong>Mobile:</strong> ${data.mobile}
//               </div>
//               <div class="contact-item">
//                 <i class="fas fa-map-marker-alt"></i>
//                 <strong>Location:</strong> ${data.location}
//               </div>
//               <div class="contact-item">
//                 <i class="fas fa-calendar-alt"></i>
//                 <strong>Appointment Date:</strong> ${data.appointmentDate}
//               </div>
//               <div class="contact-item">
//                 <i class="fas fa-clock"></i>
//                 <strong>Available Hours:</strong> ${data.availableHours}
//               </div>
//             </div>
//           </div>

//           <div class="social-links">
//             <a href="${data.facebook || '#'}"><i class="fab fa-facebook social-icon"></i></a>
//             <a href="${data.instagram || '#'}"><i class="fab fa-instagram social-icon"></i></a>
//             <a href="${data.linkedin || '#'}"><i class="fab fa-linkedin social-icon"></i></a>
//             <a href="${data.whatsapp || '#'}"><i class="fab fa-whatsapp social-icon"></i></a>
//           </div>

//           <div class="appointment-footer">
//             <div class="border"></div>
//             <strong>Appointment Details</strong>
//             <div class="border"></div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `);
//   } catch (err) {
//     res.status(500).send('Error generating template');
//   }
// };

// module.exports = { generateTemplate, getTemplateByNumber };
// const QRCode = require('qrcode');
// const Template = require('../models/Template');
// const fs = require('fs');
// const path = require('path');

// // In-memory stores
// const dataStore = {};
// const nameStore = {};

// // Generate a new template and QR code
// const generateTemplate = async (req, res) => {
//   try {
//     const {
//       name, profession, facebook, instagram, linkedin, whatsapp, aboutMe, email,
//       mobile, location, appointmentDate, availableHours
//     } = req.body;

//     if (!name || !profession || !facebook || !instagram || !whatsapp || !aboutMe || !email || !mobile || !location || !appointmentDate || !availableHours) {
//       return res.status(400).json({ message: 'All fields are required to generate the link' });
//     }

//     const profileImage = req.files && req.files.profileImage ? `/uploads/${req.files.profileImage[0].filename}` : null;
//     const coverImage = req.files && req.files.coverImage ? `/uploads/${req.files.coverImage[0].filename}` : null;

//     // Move the files to a permanent directory if necessary
//     const permanentDirectory = path.join(__dirname, '../uploads');
    
//     if (profileImage) {
//       const tempPath = req.files.profileImage[0].path;
//       const newProfileImagePath = path.join(permanentDirectory, req.files.profileImage[0].filename);
//       fs.renameSync(tempPath, newProfileImagePath); // Move file from temp to permanent directory
//     }

//     if (coverImage) {
//       const tempPath = req.files.coverImage[0].path;
//       const newCoverImagePath = path.join(permanentDirectory, req.files.coverImage[0].filename);
//       fs.renameSync(tempPath, newCoverImagePath); // Move file from temp to permanent directory
//     }

//     // Save the template data in MongoDB
//     const template = new Template({
//       name, profession, facebook, instagram, linkedin, whatsapp, aboutMe, email,
//       mobile, location, appointmentDate, availableHours, profileImage, coverImage
//     });
//     await template.save();

//     // Use the template's _id to generate the public link
//     const publicLink = `http://localhost:3003/template/${template._id}`;
//     const qrCodeBase64 = await QRCode.toDataURL(publicLink);

//     // Store the data in memory (if needed, this can be removed if not required)
//     dataStore[template._id] = {
//       profession, facebook, instagram, linkedin, whatsapp, aboutMe, email, mobile,
//       location, appointmentDate, availableHours, profileImage, coverImage,
//     };

//     nameStore[template._id] = name.toLowerCase();

//     res.json({ publicLink, qrCodeBase64 });
//   } catch (err) {
//     console.log({ message: err.message });
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Fetch the generated template using the unique template ID
// const getTemplateByNumber = (req, res) => {
//   const id = req.params.id;
//   const data = dataStore[id];

//   if (!data) {
//     return res.status(404).send('Template not found');
//   }

//   const name = nameStore[id];
//   const profileImageUrl = data.profileImage ? `http://localhost:3003${data.profileImage}` : '#';
//   const coverImageUrl = data.coverImage ? `http://localhost:3003${data.coverImage}` : '#';

//   try {
//     res.send(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Resume Template</title>
//         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
//         <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Segoe+UI:wght@400;700&display=swap">
//         <style>
//           body {
//             font-family: 'Segoe UI', sans-serif;
//             background-color: #f4f4f4;
//             margin: 0;
//             padding: 0;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             min-height: 100vh;
//           }
//           .resume-template {
//             width: 428px;
//             background-color: #033637;
//             border-radius: 16px;
//             box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
//             overflow: hidden;
//             transition: transform 0.5s ease-in-out;
//             position: relative;
//             display: flex;
//             flex-direction: column;
//           }
//           .resume-template:hover {
//             transform: scale(1.05);
//           }
//           .cover-image {
//             width: 100%;
//             height: 250px;
//             object-fit: cover;
//             opacity: 0.9;
//           }
//           .profile-image {
//             width: 110px;
//             height: 110px;
//             border-radius: 50%;
//             border: 4px solid #fff;
//             position: absolute;
//             top: 180px;
//             left: 30px;
//             object-fit: cover;
//             box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
//           }
//           .about-section {
//             margin-top: 140px;
//             padding: 20px;
//             color: white;
//             position: relative;
//             z-index: 1;
//           }
//           .name {
//             font-size: 28px;
//             color: #C29843;
//           }
//           .profession {
//             font-size: 18px;
//             color: #CDECEE;
//           }
//           .about-me {
//             margin-top: 10px;
//             color: #c1e1e1;
//             font-size: 14px;
//           }
//           .contact-section {
//             padding: 20px;
//             color: white;
//           }
//           .contact-grid {
//             display: flex;
//             flex-direction: column;
//           }
//           .contact-item {
//             width: 100%;
//             margin-bottom: 10px;
//             padding: 10px;
//             border-radius: 8px;
//             display: flex;
//             align-items: center;
//           }
//           .contact-item i {
//             margin-right: 10px;
//             color: gold;
//           }
//           .social-links {
//             display: flex;
//             justify-content: center;
//             margin-top: 20px;
//             padding: 20px;
//           }
//           .social-icon {
//             font-size: 24px;
//             color: gold;
//             margin: 0 10px;
//           }
//           .appointment-footer {
//             margin-top: 20px;
//             text-align: center;
//             font-size: 14px;
//           }
//           .border {
//             width: 50px;
//             height: 1px;
//             background-color: #C29843;
//             margin: 5px auto;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="resume-template">
//           <img src="${coverImageUrl}" alt="Cover Image" class="cover-image" />
//           <img src="${profileImageUrl}" alt="Profile Image" class="profile-image" />
          
//           <div class="about-section">
//             <div class="name">${name}</div>
//             <div class="profession">${data.profession}</div>
//             <div class="about-me">${data.aboutMe}</div>
//           </div>

//           <div class="contact-section">
//             <div class="contact-grid">
//               <div class="contact-item">
//                 <i class="fas fa-envelope"></i>
//                 <strong>Email:</strong> ${data.email}
//               </div>
//               <div class="contact-item">
//                 <i class="fas fa-phone"></i>
//                 <strong>Mobile:</strong> ${data.mobile}
//               </div>
//               <div class="contact-item">
//                 <i class="fas fa-map-marker-alt"></i>
//                 <strong>Location:</strong> ${data.location}
//               </div>
//               <div class="contact-item">
//                 <i class="fas fa-calendar-alt"></i>
//                 <strong>Appointment Date:</strong> ${data.appointmentDate}
//               </div>
//               <div class="contact-item">
//                 <i class="fas fa-clock"></i>
//                 <strong>Available Hours:</strong> ${data.availableHours}
//               </div>
//             </div>
//           </div>

//           <div class="social-links">
//             <a href="${data.facebook}" class="social-icon"><i class="fab fa-facebook"></i></a>
//             <a href="${data.instagram}" class="social-icon"><i class="fab fa-instagram"></i></a>
//             <a href="${data.linkedin}" class="social-icon"><i class="fab fa-linkedin"></i></a>
//             <a href="${data.whatsapp}" class="social-icon"><i class="fab fa-whatsapp"></i></a>
//           </div>
//           <div class="appointment-footer">
//             <div class="border"></div>
//             <span>Book your appointment now!</span>
//           </div>
//         </div>
//       </body>
//       </html>
//     `);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send('Server error');
//   }
// };

// module.exports = {
//   generateTemplate,
//   getTemplateByNumber,
// };
const QRCode = require('qrcode');
const Template = require('../models/Template');
const fs = require('fs');
const path = require('path');

// In-memory stores
const dataStore = {};
const nameStore = {};

// Generate a new template and QR code
const generateTemplate = async (req, res) => {
  try {
    const {
      name, profession, facebook, instagram, linkedin, whatsapp, aboutMe, email,
      mobile, location, appointmentDate, availableHours
    } = req.body;

    if (!name || !profession || !facebook || !instagram || !whatsapp || !aboutMe || !email || !mobile || !location || !appointmentDate || !availableHours) {
      return res.status(400).json({ message: 'All fields are required to generate the link' });
    }

    // Check if files are uploaded
    const profileImage = req.files && req.files.profileImage ? req.files.profileImage[0].filename : null;
    const coverImage = req.files && req.files.coverImage ? req.files.coverImage[0].filename : null;

    // Move the uploaded files to the `/tmp` directory
    const tmpDir = '/tmp'; // Temporary directory
    let profileImagePath = null;
    let coverImagePath = null;

    if (profileImage) {
      const tempProfileImagePath = req.files.profileImage[0].path;
      profileImagePath = path.join(tmpDir, req.files.profileImage[0].filename); // Save in /tmp
      fs.renameSync(tempProfileImagePath, profileImagePath); // Move file to /tmp
    }

    if (coverImage) {
      const tempCoverImagePath = req.files.coverImage[0].path;
      coverImagePath = path.join(tmpDir, req.files.coverImage[0].filename); // Save in /tmp
      fs.renameSync(tempCoverImagePath, coverImagePath); // Move file to /tmp
    }

    // Save the template data in MongoDB
    const template = new Template({
      name, profession, facebook, instagram, linkedin, whatsapp, aboutMe, email,
      mobile, location, appointmentDate, availableHours, profileImage: profileImagePath, coverImage: coverImagePath
    });
    await template.save();

    // Use the template's _id to generate the public link
    const publicLink = `http://localhost:3003/template/${template._id}`;
    const qrCodeBase64 = await QRCode.toDataURL(publicLink);

    // Store the data in memory (optional, remove if not required)
    dataStore[template._id] = {
      profession, facebook, instagram, linkedin, whatsapp, aboutMe, email, mobile,
      location, appointmentDate, availableHours, profileImage, coverImage,
    };

    nameStore[template._id] = name.toLowerCase();

    res.json({ publicLink, qrCodeBase64 });
  } catch (err) {
    console.log({ message: err.message });
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch the generated template using the unique template ID
const getTemplateByNumber = (req, res) => {
  const id = req.params.id;
  const data = dataStore[id];

  if (!data) {
    return res.status(404).send('Template not found');
  }

  const name = nameStore[id];
  const profileImageUrl = data.profileImage ? `http://localhost:3003${data.profileImage}` : '#';
  const coverImageUrl = data.coverImage ? `http://localhost:3003${data.coverImage}` : '#';

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
            color: gold;
          }
          .social-links {
            display: flex;
            justify-content: center;
            margin-top: 20px;
            padding: 20px;
          }
          .social-icon {
            font-size: 24px;
            color: gold;
            margin: 0 10px;
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
          <img src="${coverImageUrl}" alt="Cover Image" class="cover-image" />
          <img src="${profileImageUrl}" alt="Profile Image" class="profile-image" />
          
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
            <a href="${data.facebook}" target="_blank"><i class="fab fa-facebook social-icon"></i></a>
            <a href="${data.instagram}" target="_blank"><i class="fab fa-instagram social-icon"></i></a>
            <a href="${data.linkedin}" target="_blank"><i class="fab fa-linkedin social-icon"></i></a>
            <a href="https://wa.me/${data.whatsapp}" target="_blank"><i class="fab fa-whatsapp social-icon"></i></a>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.log({ message: err.message });
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { generateTemplate, getTemplateByNumber };
