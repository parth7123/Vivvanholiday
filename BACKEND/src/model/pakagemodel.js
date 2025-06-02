const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true, validate: [arr => arr.length > 0, 'At least one image URL is required'] },
  duration: { type: String, required: true },
  places: [{ type: String }],
  type: { type: String, enum: ['domestic', 'international'], required: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now }
});

module.exports = mongoose.model('Package', packageSchema);
