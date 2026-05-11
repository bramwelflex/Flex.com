const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send email function
const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'hello@designer.com',
            to,
            subject,
            html
        });
        console.log('✅ Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Email error:', error);
        throw error;
    }
};

// Email templates
const templates = {
    bookingConfirmation: (name, service, date) => `
        <div style="font-family: Poppins, sans-serif; color: #E0E0E0; background: #0A0E27; padding: 20px;">
            <h2 style="color: #0077FF;">✨ Booking Confirmed!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for booking with me! Here are your booking details:</p>
            <div style="background: rgba(0, 119, 255, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <p>I'll reach out to you shortly to discuss your project details.</p>
            <p>Best regards,<br>Designer</p>
        </div>
    `,

    contactConfirmation: (name) => `
        <div style="font-family: Poppins, sans-serif; color: #E0E0E0; background: #0A0E27; padding: 20px;">
            <h2 style="color: #0077FF;">📬 Message Received!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for reaching out! I've received your message and will get back to you within 24 hours.</p>
            <p>In the meantime, feel free to check out my portfolio or book a consultation.</p>
            <p>Best regards,<br>Designer</p>
        </div>
    `,

    newsletterWelcome: (email) => `
        <div style="font-family: Poppins, sans-serif; color: #E0E0E0; background: #0A0E27; padding: 20px;">
            <h2 style="color: #0077FF;">🎨 Welcome to My Newsletter!</h2>
            <p>Hi,</p>
            <p>Thanks for subscribing to my design insights and updates!</p>
            <p>You'll receive:</p>
            <ul>
                <li>🎯 Design tips and industry trends</li>
                <li>✨ Behind-the-scenes of my projects</li>
                <li>💼 Special offers for subscribers</li>
                <li>📚 Creative resources and tools</li>
            </ul>
            <p>Stay creative!<br>Designer</p>
        </div>
    `,

    paymentConfirmation: (email, amount, service) => `
        <div style="font-family: Poppins, sans-serif; color: #E0E0E0; background: #0A0E27; padding: 20px;">
            <h2 style="color: #0077FF;">💳 Payment Confirmed!</h2>
            <p>Hi,</p>
            <p>Your payment has been processed successfully!</p>
            <div style="background: rgba(0, 119, 255, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p><strong>Amount:</strong> $${amount}</p>
                <p><strong>Service:</strong> ${service}</p>
            </div>
            <p>Thank you for your business! Let's create something amazing together.</p>
            <p>Best regards,<br>Designer</p>
        </div>
    `
};

module.exports = {
    sendEmail,
    templates
};
