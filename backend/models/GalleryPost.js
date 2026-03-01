const mongoose = require('mongoose');

const GalleryPostSchema = new mongoose.Schema({
    category: { type: String, enum: ['personal', 'projects', 'achievements'], required: true },
    caption: { type: String, required: true },
    photos: [{ type: String }], // Array of image URLs/paths
}, { timestamps: true });

module.exports = mongoose.model('GalleryPost', GalleryPostSchema);
