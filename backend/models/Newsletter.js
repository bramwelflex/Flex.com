const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    firstName: String,
    lastName: String,
    subscribed: {
        type: Boolean,
        default: true
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
