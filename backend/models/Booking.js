const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    service: {
        type: String,
        enum: ['branding', 'web', 'ui', 'consultation'],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
