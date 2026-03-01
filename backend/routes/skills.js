const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Skill = require('../models/Skill');
const SkillCategory = require('../models/SkillCategory');

// Multer for skill logo images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads/skills');
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── Skill Bubbles ──────────────────────────────────────────

// GET /api/skills — public
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find().sort({ createdAt: 1 });
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/skills — admin
router.post('/', auth, upload.single('logo'), async (req, res) => {
    try {
        const { name, logoUrl } = req.body;
        const resolvedLogo = req.file ? `/uploads/skills/${req.file.filename}` : logoUrl;
        const skill = new Skill({ name, logoUrl: resolvedLogo });
        await skill.save();
        res.status(201).json(skill);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/skills/:id — admin
router.put('/:id', auth, upload.single('logo'), async (req, res) => {
    try {
        const { name, logoUrl } = req.body;
        const update = { name };
        if (req.file) update.logoUrl = `/uploads/skills/${req.file.filename}`;
        else if (logoUrl) update.logoUrl = logoUrl;

        const skill = await Skill.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!skill) return res.status(404).json({ error: 'Not found' });
        res.json(skill);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/skills/:id — admin
router.delete('/:id', auth, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        if (!skill) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Skill Categories (Text Section) ────────────────────────

// GET /api/skills/categories — public
router.get('/categories', async (req, res) => {
    try {
        const cats = await SkillCategory.find().sort({ rowIndex: 1, order: 1 });
        res.json(cats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/skills/categories — admin
router.post('/categories', auth, async (req, res) => {
    try {
        const { title, items, rowIndex, order } = req.body;
        const cat = new SkillCategory({ title, items, rowIndex, order });
        await cat.save();
        res.status(201).json(cat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/skills/categories/:id — admin
router.put('/categories/:id', auth, async (req, res) => {
    try {
        const { title, items, rowIndex, order } = req.body;
        const cat = await SkillCategory.findByIdAndUpdate(
            req.params.id,
            { title, items, rowIndex, order },
            { new: true }
        );
        if (!cat) return res.status(404).json({ error: 'Not found' });
        res.json(cat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/skills/categories/:id — admin
router.delete('/categories/:id', auth, async (req, res) => {
    try {
        const cat = await SkillCategory.findByIdAndDelete(req.params.id);
        if (!cat) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
