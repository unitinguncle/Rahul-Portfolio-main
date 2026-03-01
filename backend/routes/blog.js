const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const BlogPost = require('../models/BlogPost');

// Multer for cover images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads/blog');
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/blog — public, newest first
router.get('/', async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ createdAt: -1 }).select('-voters');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/blog — admin
router.post('/', auth, upload.single('coverImage'), async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const tagsArray = tags ? JSON.parse(tags) : [];
        const coverImageUrl = req.file ? `/uploads/blog/${req.file.filename}` : (req.body.coverImageUrl || '');
        const post = new BlogPost({ title, content, tags: tagsArray, coverImageUrl });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/blog/:id — admin
router.put('/:id', auth, upload.single('coverImage'), async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const tagsArray = tags ? JSON.parse(tags) : undefined;
        const update = { title, content };
        if (tagsArray) update.tags = tagsArray;
        if (req.file) update.coverImageUrl = `/uploads/blog/${req.file.filename}`;
        else if (req.body.coverImageUrl !== undefined) update.coverImageUrl = req.body.coverImageUrl;

        const post = await BlogPost.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!post) return res.status(404).json({ error: 'Not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/blog/:id — admin
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/blog/:id/vote — public but IP-limited
router.post('/:id/vote', async (req, res) => {
    try {
        const { type } = req.body; // 'agree' or 'disagree'
        if (!['agree', 'disagree'].includes(type)) {
            return res.status(400).json({ error: 'Invalid vote type' });
        }

        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const post = await BlogPost.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Not found' });

        if (post.voters.includes(ip)) {
            return res.status(400).json({ error: 'Already voted' });
        }

        post[type] += 1;
        post.voters.push(ip);
        await post.save();

        res.json({ agree: post.agree, disagree: post.disagree });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
