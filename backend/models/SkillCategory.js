const mongoose = require('mongoose');

const SkillCategorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    items: [{ type: String }],
    rowIndex: { type: Number, default: 0 }, // For grouping rows visually
    order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('SkillCategory', SkillCategorySchema);
