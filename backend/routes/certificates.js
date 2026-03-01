const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Certificate = require('../models/Certificate');

// Multer for certificate images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads/certs');
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/certificates — public, grouped
router.get('/', async (req, res) => {
    try {
        const certs = await Certificate.find().sort({ createdAt: -1 });
        const grouped = { tech: [], other: [] };
        certs.forEach(c => {
            if (grouped[c.category]) grouped[c.category].push(c);
        });
        res.json(grouped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/certificates — admin
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, org, date, category } = req.body;
        const imageUrl = req.file ? `/uploads/certs/${req.file.filename}` : (req.body.imageUrl || '');
        const cert = new Certificate({ title, org, date, category, imageUrl });
        await cert.save();
        res.status(201).json(cert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/certificates/:id — admin
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, org, date, category } = req.body;
        const update = { title, org, date, category };
        if (req.file) update.imageUrl = `/uploads/certs/${req.file.filename}`;
        else if (req.body.imageUrl) update.imageUrl = req.body.imageUrl;

        const cert = await Certificate.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!cert) return res.status(404).json({ error: 'Not found' });
        res.json(cert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/certificates/:id — admin
router.delete('/:id', auth, async (req, res) => {
    try {
        const cert = await Certificate.findByIdAndDelete(req.params.id);
        if (!cert) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
