const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendEmail, templates } = require('../config/email');

// Submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create contact record
        const contact = new Contact({
            name,
            email,
            subject,
            message
        });

        await contact.save();

        // Send confirmation email to client
        try {
            await sendEmail(
                email,
                '📬 We Received Your Message',
                templates.contactConfirmation(name)
            );

            // Send notification email to admin
            await sendEmail(
                process.env.ADMIN_EMAIL || 'hello@designer.com',
                `📬 New Contact Form Submission: ${subject}`,
                `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong> ${message}</p>`
            );
        } catch (emailError) {
            console.error('Email send failed:', emailError);
        }

        res.status(201).json({
            message: 'Message sent successfully! I will get back to you soon.',
            contact
        });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all messages (admin)
router.get('/', async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark message as read
router.patch('/:id/read', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status: 'read' },
            { new: true }
        );
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete message
router.delete('/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
