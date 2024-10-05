const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { type: String },
  profession: { type: String },
  facebook: { type: String },
  instagram: { type: String },
  linkedin: { type: String },
  whatsapp: { type: String },
  aboutMe: { type: String },
  email: { type: String },
  mobile: { type: String },
  location: { type: String },
  appointmentDate: { type: String },
  availableHours: { type: String },
  profileImage: { type: String },
  coverImage: { type: String },
  qrCode: { type: String },
  galleryImages: { type: [String], default: [] },
  productImages: { type: [String], default: [] }
}, { timestamps: true });

const Template = mongoose.model('Template', templateSchema);
module.exports = Template;
