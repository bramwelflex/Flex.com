const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    stripePaymentId: String,
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'usd'
    },
    status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed'],
        default: 'pending'
    },
    email: String,
    service: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
