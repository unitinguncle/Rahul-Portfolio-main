const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
