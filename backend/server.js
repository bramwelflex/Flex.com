require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8000', 'http://localhost:5000'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static('.'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend is running!', timestamp: new Date() });
});

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/designer-portfolio', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        status: err.status || 500
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email Service: ${process.env.EMAIL_SERVICE}`);
    console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Not configured'}`);
});

module.exports = app;
