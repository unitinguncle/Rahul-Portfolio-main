const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const About = require('../models/About');

// GET /api/about — public
router.get('/', async (req, res) => {
    try {
        const about = await About.findOne();
        res.json(about || { bio: [], education: [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/about — admin, upsert entire document
router.put('/', auth, async (req, res) => {
    try {
        const { bio, education } = req.body;
        const about = await About.findOneAndUpdate(
            {},
            { bio, education },
            { upsert: true, new: true }
        );
        res.json(about);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
