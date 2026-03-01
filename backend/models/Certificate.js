const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    org: { type: String, required: true },
    date: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    category: { type: String, enum: ['tech', 'other'], default: 'other' },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);
