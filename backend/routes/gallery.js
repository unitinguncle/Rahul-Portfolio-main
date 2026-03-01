const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const GalleryPost = require('../models/GalleryPost');

// Multer for multiple gallery images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads/gallery');
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// GET /api/gallery — public
router.get('/', async (req, res) => {
    try {
        const posts = await GalleryPost.find().sort({ createdAt: -1 });
        // Group by category
        const grouped = { personal: [], projects: [], achievements: [] };
        posts.forEach(p => {
            if (grouped[p.category]) grouped[p.category].push(p);
        });
        res.json(grouped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/gallery/all — flat list for admin
router.get('/all', auth, async (req, res) => {
    try {
        const posts = await GalleryPost.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/gallery — admin, up to 10 images
router.post('/', auth, upload.array('photos', 10), async (req, res) => {
    try {
        const { category, caption } = req.body;
        const uploadedPhotos = req.files ? req.files.map(f => `/uploads/gallery/${f.filename}`) : [];
        // Also allow passing existing URL strings
        const extraUrls = req.body.photoUrls ? JSON.parse(req.body.photoUrls) : [];
        const photos = [...uploadedPhotos, ...extraUrls];

        const post = new GalleryPost({ category, caption, photos });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/gallery/:id — admin
router.put('/:id', auth, upload.array('photos', 10), async (req, res) => {
    try {
        const { category, caption } = req.body;
        const update = { category, caption };
        const newPhotos = req.files ? req.files.map(f => `/uploads/gallery/${f.filename}`) : [];
        const existingPhotos = req.body.existingPhotos ? JSON.parse(req.body.existingPhotos) : undefined;

        if (existingPhotos !== undefined || newPhotos.length > 0) {
            update.photos = [...(existingPhotos || []), ...newPhotos];
        }

        const post = await GalleryPost.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!post) return res.status(404).json({ error: 'Not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/gallery/:id — admin
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await GalleryPost.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
