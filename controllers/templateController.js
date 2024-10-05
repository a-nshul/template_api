const cloudinary = require('cloudinary').v2;
const Template = require('../models/Template');
const QRCode = require('qrcode');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateTemplate = async (req, res) => {
  try {
    const {
      name, profession, facebook, instagram, whatsapp, aboutMe, email,
      mobile, location, appointmentDate, availableHours,
    } = req.body;

    // Access the profile, cover, gallery, and product images from the request
    const profileImage = req.files.profileImage ? req.files.profileImage[0] : null;
    const coverImage = req.files.coverImage ? req.files.coverImage[0] : null;
    const galleryImages = req.files.galleryImages || []; // Multiple gallery images
    const productImages = req.files.productImages || []; // Multiple product images

    let coverImageUrl = null;
    let profileImageUrl = null;
    const galleryImageUrls = [];
    const productImageUrls = [];

    // Upload profile image to Cloudinary if it exists
    if (profileImage) {
      try {
        profileImageUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'profile_images' }, (error, result) => {
            if (error) {
              reject(new Error('Cloudinary upload failed'));
            } else {
              resolve(result.secure_url); // Get the secure URL of the uploaded image
            }
          });
          stream.end(profileImage.buffer);
        });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }

    // Upload cover image to Cloudinary if it exists
    if (coverImage) {
      try {
        coverImageUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'cover_images' }, (error, result) => {
            if (error) {
              reject(new Error('Cloudinary upload failed'));
            } else {
              resolve(result.secure_url);
            }
          });
          stream.end(coverImage.buffer);
        });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }

    // Upload gallery images to Cloudinary
    for (const image of galleryImages) {
      try {
        const imageUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'gallery_images' }, (error, result) => {
            if (error) {
              reject(new Error('Cloudinary upload failed'));
            } else {
              resolve(result.secure_url);
            }
          });
          stream.end(image.buffer);
        });
        galleryImageUrls.push(imageUrl);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }

    // Upload product images to Cloudinary
    for (const image of productImages) {
      try {
        const imageUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'product_images' }, (error, result) => {
            if (error) {
              reject(new Error('Cloudinary upload failed'));
            } else {
              resolve(result.secure_url);
            }
          });
          stream.end(image.buffer);
        });
        productImageUrls.push(imageUrl);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }

    // Save the template data in MongoDB
    const template = new Template({
      name,
      profession,
      facebook,
      instagram,
      whatsapp,
      aboutMe,
      email,
      mobile,
      location,
      appointmentDate,
      availableHours,
      profileImage: profileImageUrl,
      coverImage: coverImageUrl,
      galleryImages: galleryImageUrls,
      productImages: productImageUrls,
    });
    await template.save();

    // Generate the public link
    const publicLink = `https://template-api-kmu4.vercel.app/template/${template._id}`;
    const qrCodeBase64 = await QRCode.toDataURL(publicLink);

    res.json({ publicLink, qrCodeBase64 });
  } catch (err) {
    console.error(err); // Log the error for better debugging
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch the generated template using the unique template ID
const getTemplateByNumber = async (req, res) => {
  const id = req.params.id;

  try {
    // Fetch the template from the database using the provided ID
    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).send('Template not found');
    }

    // Construct the profile and cover image URLs
    const profileImageUrl = template.profileImage || '#'; // Fallback to '#' if no image is provided
    const coverImageUrl = template.coverImage || '#'; // Fallback to '#' if no image is provided

    // Fetch gallery and product images from the template
    const galleryImages = template.galleryImages || []; // Fallback to empty array if no images are provided
    const productImages = template.productImages || []; // Fallback to empty array if no images are provided
    const services = template.services || []; // Fallback to empty array if no services are provided

    // Render the template
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume Template</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Segoe+UI:wght@400;700&display=swap" rel="stylesheet">
          <style>
              /* Global Styles */
              body, html {
                  height: 100%;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background-color: #f2f2f2;
              }

              .center-wrapper {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100%;
                  width: 100%;
              }

              .resume-container {
                  width: 450px;
                  padding: 24px;
                  background: conic-gradient(from -71.84deg at 50% 50%, #191B1C 0deg, #5E060E 360deg);
                  border-radius: 12px;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                  margin: 0 auto;
              }

              .preview-heading {
                  font-size: 24px;
                  font-weight: bold;
                  text-align: center;
                  margin-bottom: 16px;
              }

              .profile-section {
                  text-align: center;
                  margin-bottom: 24px;
              }

              .cover-image {
                  width: 100%;
                  height: 200px;
                  background-image: url('${coverImageUrl}');
                  background-size: cover;
                  background-position: center;
                  margin-bottom: 12px;
              }

              .profile-image {
                  width: 128px;
                  height: 128px;
                  border-radius: 50%;
                  background-image: url('${profileImageUrl}');
                  background-size: cover;
                  background-position: center;
                  margin: -64px auto 12px auto;
                  border: 4px solid white;
              }

              .full-name {
                  font-size: 32px;
                  font-weight: bold;
                  margin-bottom: 4px;
              }

              .designation {
                  font-size: 16px;
                  font-weight: lighter;
                  color: #ddd;
              }

              .social-icons {
                  display: flex;
                  justify-content: center;
                  gap: 16px;
                  margin: 16px 0;
              }

              .social-link {
                  font-size: 24px;
                  color: white;
                  transition: transform 0.3s ease-in-out;
              }

              .social-link:hover {
                  transform: scale(1.2);
              }

              .about-me {
                  background-color: #F9FEFF;
                  color: #333;
                  padding: 16px;
                  border-radius: 8px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                  margin-bottom: 24px;
              }

              .about-me h3 {
                  font-size: 20px;
                  font-weight: 600;
                  margin-bottom: 8px;
              }

              .about-me p {
                  font-size: 14px;
                  line-height: 1.5;
              }

              /* Gallery Styles */
              .gallery {
                  margin-bottom: 24px;
              }

              .gallery h3 {
                  font-size: 20px;
                  margin-bottom: 12px;
              }

              .gallery-images {
                  display: flex;
                  justify-content: space-between;
                  flex-wrap: wrap;
                  gap: 8px;
              }

              .gallery-images img {
                  width: 30%;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }

              /* Products Styles */
              .products {
                  margin-bottom: 24px;
              }

              .products h3 {
                  font-size: 20px;
                  margin-bottom: 12px;
              }

              .product-images {
                  display: flex;
                  justify-content: space-between;
                  flex-wrap: wrap;
                  gap: 8px;
              }

              .product-images img {
                  width: 30%;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }

              /* Services Styles */
              .services {
                  margin-bottom: 24px;
              }

              .services h3 {
                  font-size: 20px;
                  margin-bottom: 12px;
              }

              .service {
                  background-color: #F9FEFF;
                  padding: 12px;
                  margin-bottom: 12px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
          </style>
      </head>
      <body>
          <div class="center-wrapper">
              <div class="resume-container">
                  <h2 class="preview-heading">Preview</h2>

                  <div class="profile-section">
                      <div class="cover-image"></div>

                      <div class="profile-image"></div>

                      <h1 class="full-name">${template.name}</h1>
                      <h2 class="designation">${template.profession}</h2>
                  </div>

                  <div class="social-icons">
                      <a href="${template.facebook || '#'}" target="_blank" class="social-link">
                          <i class="fab fa-facebook"></i>
                      </a>
                      <a href="${template.instagram || '#'}" target="_blank" class="social-link">
                          <i class="fab fa-instagram"></i>
                      </a>
                      <a href="${template.linkedin || '#'}" target="_blank" class="social-link">
                          <i class="fab fa-linkedin"></i>
                      </a>
                      <a href="${template.whatsapp || '#'}" target="_blank" class="social-link">
                          <i class="fab fa-whatsapp"></i>
                      </a>
                  </div>

                  <div class="about-me">
                      <h3>About Me</h3>
                      <p>${template.aboutMe}</p>
                  </div>

                  <!-- Gallery Section -->
                  <div class="gallery">
                      <h3>Gallery</h3>
                      <div class="gallery-images">
                          ${galleryImages.map(image => `<img src="${image}" alt="Gallery Image" />`).join('')}
                      </div>
                  </div>

                  <!-- Product Section -->
                  <div class="products">
                      <h3>Products</h3>
                      <div class="product-images">
                          ${productImages.map(image => `<img src="${image}" alt="Product Image" />`).join('')}
                      </div>
                  </div>

                  <!-- Services Section -->
                  <div class="services">
                      <h3>Services</h3>
                      ${services.map(service => `
                          <div class="service">
                              <h4>${service.name}</h4>
                              <p>${service.description}</p>
                          </div>
                      `).join('')}
                  </div>
              </div>
          </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error fetching template:", error);
    return res.status(500).send('Internal Server Error');
  }
};


module.exports = { generateTemplate, getTemplateByNumber };
