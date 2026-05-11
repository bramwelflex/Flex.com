const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user exists
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create user
        const user = new User({
            username,
            email,
            password,
            role: 'user'
        });

        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create admin user (run once)
router.post('/setup-admin', async (req, res) => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        const admin = new User({
            username: 'admin',
            email: process.env.ADMIN_EMAIL || 'admin@designer.com',
            password: process.env.ADMIN_PASSWORD || 'admin123',
            role: 'admin'
        });

        await admin.save();

        res.json({
            message: 'Admin user created',
            user: { username: admin.username, email: admin.email }
        });
    } catch (error) {
        console.error('Setup admin error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
