const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
const createPaymentIntent = async (amount, metadata) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            metadata
        });
        return paymentIntent;
    } catch (error) {
        console.error('Stripe error:', error);
        throw error;
    }
};

// Verify payment
const verifyPayment = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent.status === 'succeeded';
    } catch (error) {
        console.error('Stripe verification error:', error);
        throw error;
    }
};

// Service prices
const servicePrices = {
    branding: 1500,
    web: 2000,
    ui: 1800,
    consultation: 500
};

module.exports = {
    createPaymentIntent,
    verifyPayment,
    servicePrices
};
