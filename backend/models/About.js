const mongoose = require('mongoose');

const EducationCardSchema = new mongoose.Schema({
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    location: { type: String, default: '' },
    gpa: { type: String, default: '' },
    years: { type: String, default: '' },
    icon: { type: String, default: 'university' }, // 'university', 'school', 'graduation'
});

const AboutSchema = new mongoose.Schema({
    // Only one About document
    bio: [{ type: String }], // Array of paragraphs
    education: [EducationCardSchema],
}, { timestamps: true });

module.exports = mongoose.model('About', AboutSchema);
