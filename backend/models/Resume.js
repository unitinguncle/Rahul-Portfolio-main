const mongoose = require('mongoose');

// Stores the current resume PDF filename
const ResumeFileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String },
    uploadedAt: { type: Date, default: Date.now },
});

// Stores all editable resume section content as JSON
const ResumeSectionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['profile', 'experience', 'education', 'projects', 'skills'],
        unique: true,
        required: true,
    },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const ResumeFile = mongoose.model('ResumeFile', ResumeFileSchema);
const ResumeSection = mongoose.model('ResumeSection', ResumeSectionSchema);

module.exports = { ResumeFile, ResumeSection };
