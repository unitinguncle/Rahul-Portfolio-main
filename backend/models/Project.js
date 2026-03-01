const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    tech: [{ type: String }],
    liveUrl: { type: String, default: '' },
    codeUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
