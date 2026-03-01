const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const adminUser = process.env.ADMIN_USERNAME || 'admin';
        const adminHash = process.env.ADMIN_PASSWORD_HASH;

        if (username !== adminUser) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        let isValid = false;
        if (adminHash) {
            // Check against bcrypt hash
            isValid = await bcrypt.compare(password, adminHash);
        } else {
            // Fallback: plain password comparison (for initial setup only)
            isValid = password === process.env.ADMIN_PASSWORD;
        }

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { username: adminUser, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, expiresIn: 86400 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/auth/verify — check if token is still valid
router.get('/verify', require('../middleware/auth'), (req, res) => {
    res.json({ valid: true, admin: req.admin });
});

module.exports = router;
