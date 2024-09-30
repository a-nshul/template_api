const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profession: { type: String, required: true },
  facebook: { type: String, required: true },
  instagram: { type: String, required: true },
  linkedin: { type: String },
  whatsapp: { type: String, required: true },
  aboutMe: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  location: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  availableHours: { type: String, required: true },
  profileImage: { type: String },
  coverImage: { type: String },
  qrCode: { type: String },  // Store QR code image or link
}, { timestamps: true });

const Template = mongoose.model('Template', templateSchema);
module.exports = Template;
