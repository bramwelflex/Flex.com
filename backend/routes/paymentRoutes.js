const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { createPaymentIntent, servicePrices } = require('../config/stripe');
const { sendEmail, templates } = require('../config/email');

// Create payment intent
router.post('/create-intent', async (req, res) => {
    try {
        const { service, bookingId, email } = req.body;

        if (!service || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const amount = servicePrices[service];
        if (!amount) {
            return res.status(400).json({ error: 'Invalid service' });
        }

        const paymentIntent = await createPaymentIntent(amount, {
            service,
            bookingId: bookingId || 'direct',
            email
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            amount
        });
    } catch (error) {
        console.error('Payment intent error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Confirm payment
router.post('/confirm', async (req, res) => {
    try {
        const { paymentIntentId, email, service, bookingId } = req.body;

        // Create payment record
        const payment = new Payment({
            stripePaymentId: paymentIntentId,
            email,
            service,
            bookingId: bookingId || null,
            amount: servicePrices[service],
            status: 'succeeded'
        });

        await payment.save();

        // If there's a booking, update its status
        if (bookingId) {
            await Booking.findByIdAndUpdate(
                bookingId,
                { status: 'confirmed' },
                { new: true }
            );
        }

        // Send confirmation email
        try {
            await sendEmail(
                email,
                '💳 Payment Confirmed!',
                templates.paymentConfirmation(email, servicePrices[service], service)
            );
        } catch (emailError) {
            console.error('Email send failed:', emailError);
        }

        res.json({
            message: 'Payment successful!',
            payment
        });
    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get payment history
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        const stats = {
            total: payments.length,
            totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
            succeeded: payments.filter(p => p.status === 'succeeded').length,
            pending: payments.filter(p => p.status === 'pending').length
        };
        res.json({ stats, payments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
