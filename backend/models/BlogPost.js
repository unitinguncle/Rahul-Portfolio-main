const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }, // Rich HTML content
    coverImageUrl: { type: String, default: '' },
    tags: [{ type: String }],
    agree: { type: Number, default: 0 },
    disagree: { type: Number, default: 0 },
    voters: [{ type: String }], // Store IP addresses to prevent double voting
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', BlogPostSchema);
