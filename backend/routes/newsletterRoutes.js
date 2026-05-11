const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const { sendEmail, templates } = require('../config/email');

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
    try {
        const { email, firstName, lastName } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if already subscribed
        let subscriber = await Newsletter.findOne({ email });

        if (subscriber) {
            if (subscriber.subscribed) {
                return res.status(400).json({ error: 'Already subscribed' });
            }
            // Resubscribe
            subscriber.subscribed = true;
            await subscriber.save();
        } else {
            // Create new subscriber
            subscriber = new Newsletter({
                email,
                firstName: firstName || '',
                lastName: lastName || ''
            });
            await subscriber.save();
        }

        // Send welcome email
        try {
            await sendEmail(
                email,
                '🎨 Welcome to My Newsletter!',
                templates.newsletterWelcome(email)
            );
        } catch (emailError) {
            console.error('Email send failed:', emailError);
        }

        res.status(201).json({
            message: 'Successfully subscribed to newsletter!',
            subscriber
        });
    } catch (error) {
        console.error('Newsletter error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const subscriber = await Newsletter.findOneAndUpdate(
            { email },
            { subscribed: false },
            { new: true }
        );

        if (!subscriber) {
            return res.status(404).json({ error: 'Subscriber not found' });
        }

        res.json({ message: 'Successfully unsubscribed', subscriber });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all subscribers (admin)
router.get('/', async (req, res) => {
    try {
        const subscribers = await Newsletter.find({ subscribed: true }).sort({ createdAt: -1 });
        res.json({
            count: subscribers.length,
            subscribers
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get subscriber stats
router.get('/stats/overview', async (req, res) => {
    try {
        const total = await Newsletter.countDocuments();
        const active = await Newsletter.countDocuments({ subscribed: true });
        const inactive = await Newsletter.countDocuments({ subscribed: false });

        res.json({
            total,
            active,
            inactive
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
