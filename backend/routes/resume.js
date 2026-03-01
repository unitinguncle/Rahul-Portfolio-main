const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { ResumeFile, ResumeSection } = require('../models/Resume');

// Multer for PDF upload
const pdfStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads/resume');
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Always use the same name so old file is overwritten
        cb(null, 'resume.pdf');
    },
});
const pdfUpload = multer({
    storage: pdfStorage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDF files allowed'));
    },
});

// GET /api/resume — public
router.get('/', async (req, res) => {
    try {
        const sections = await ResumeSection.find();
        const sectionsMap = {};
        sections.forEach(s => { sectionsMap[s.type] = s.content; });

        const latestFile = await ResumeFile.findOne().sort({ uploadedAt: -1 });
        res.json({
            sections: sectionsMap,
            pdfUrl: latestFile ? `/uploads/resume/resume.pdf` : null,
            pdfOriginalName: latestFile?.originalName || null,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/resume/:section — admin, update a section
router.put('/:section', auth, async (req, res) => {
    try {
        const { section } = req.params;
        const allowedSections = ['profile', 'experience', 'education', 'projects', 'skills'];
        if (!allowedSections.includes(section)) {
            return res.status(400).json({ error: 'Invalid section' });
        }

        const updated = await ResumeSection.findOneAndUpdate(
            { type: section },
            { type: section, content: req.body.content },
            { upsert: true, new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/resume/upload — admin, upload/replace PDF
router.post('/upload', auth, pdfUpload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        // Track upload in DB
        await ResumeFile.create({
            filename: req.file.filename,
            originalName: req.file.originalname,
        });

        res.json({
            success: true,
            pdfUrl: `/uploads/resume/resume.pdf`,
            originalName: req.file.originalname,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
