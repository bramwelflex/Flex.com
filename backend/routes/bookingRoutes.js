const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { sendEmail, templates } = require('../config/email');

// Create booking
router.post('/', async (req, res) => {
    try {
        const { name, email, service, date } = req.body;

        // Validate required fields
        if (!name || !email || !service || !date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create booking
        const booking = new Booking({
            name,
            email,
            service,
            date: new Date(date)
        });

        await booking.save();

        // Send confirmation email
        try {
            await sendEmail(
                email,
                '✨ Booking Confirmed!',
                templates.bookingConfirmation(name, service, date)
            );
        } catch (emailError) {
            console.error('Email send failed:', emailError);
            // Don't fail the request if email fails
        }

        res.status(201).json({
            message: 'Booking created successfully!',
            booking
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all bookings (admin)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete booking
router.delete('/:id', async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
