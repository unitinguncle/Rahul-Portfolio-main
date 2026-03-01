const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Project = require('../models/Project');

// Multer config for project images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads/projects');
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/projects — public, sorted newest first
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/projects — admin only
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, desc, tech, liveUrl, codeUrl } = req.body;
        const techArray = tech ? JSON.parse(tech) : [];
        const imageUrl = req.file ? `/uploads/projects/${req.file.filename}` : (req.body.imageUrl || '');

        const project = new Project({ title, desc, tech: techArray, liveUrl, codeUrl, imageUrl });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/projects/:id — admin only
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, desc, tech, liveUrl, codeUrl } = req.body;
        const techArray = tech ? JSON.parse(tech) : undefined;
        const update = { title, desc, liveUrl, codeUrl };
        if (techArray) update.tech = techArray;
        if (req.file) update.imageUrl = `/uploads/projects/${req.file.filename}`;
        else if (req.body.imageUrl) update.imageUrl = req.body.imageUrl;

        const project = await Project.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!project) return res.status(404).json({ error: 'Not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/projects/:id — admin only
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
