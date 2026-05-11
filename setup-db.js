// MongoDB Setup Script
// This script initializes the database with all necessary collections

const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Import models
const User = require('./backend/models/User');
const Booking = require('./backend/models/Booking');
const Contact = require('./backend/models/Contact');
const Newsletter = require('./backend/models/Newsletter');
const Payment = require('./backend/models/Payment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/designer-portfolio';

async function setupDatabase() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        console.log(`📍 Database URI: ${MONGODB_URI}`);

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Create collections with models
        console.log('\n📋 Creating collections...\n');

        // Users Collection
        await User.collection.drop().catch(() => {}); // Drop if exists
        await User.collection.createIndex({ email: 1 }, { unique: true });
        console.log('✅ Users collection created');

        // Bookings Collection
        await Booking.collection.drop().catch(() => {});
        await Booking.collection.createIndex({ email: 1 });
        await Booking.collection.createIndex({ date: 1 });
        console.log('✅ Bookings collection created');

        // Contacts Collection
        await Contact.collection.drop().catch(() => {});
        await Contact.collection.createIndex({ email: 1 });
        await Contact.collection.createIndex({ status: 1 });
        console.log('✅ Contacts collection created');

        // Newsletter Collection
        await Newsletter.collection.drop().catch(() => {});
        await Newsletter.collection.createIndex({ email: 1 }, { unique: true });
        console.log('✅ Newsletter collection created');

        // Payments Collection
        await Payment.collection.drop().catch(() => {});
        await Payment.collection.createIndex({ bookingId: 1 });
        await Payment.collection.createIndex({ stripePaymentId: 1 });
        console.log('✅ Payments collection created');

        // Create default admin user
        console.log('\n👤 Creating default admin user...\n');
        
        const defaultAdmin = {
            username: 'admin',
            email: process.env.ADMIN_EMAIL || 'admin@designer.com',
            password: process.env.ADMIN_PASSWORD || 'admin123',
            role: 'admin'
        };

        const existingAdmin = await User.findOne({ email: defaultAdmin.email });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
        } else {
            const admin = new User(defaultAdmin);
            await admin.save();
            console.log(`✅ Admin user created`);
            console.log(`   Email: ${defaultAdmin.email}`);
            console.log(`   Password: ${defaultAdmin.password}`);
        }

        console.log('\n' + '='.repeat(50));
        console.log('🎉 Database setup complete!');
        console.log('='.repeat(50));
        console.log('\n📊 Collections created:');
        console.log('   • Users (with unique email index)');
        console.log('   • Bookings (with email and date indexes)');
        console.log('   • Contacts (with email and status indexes)');
        console.log('   • Newsletter (with unique email index)');
        console.log('   • Payments (with bookingId and stripePaymentId indexes)');
        console.log('\n🚀 You can now start the backend with: npm run dev');

        process.exit(0);
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.error('\n' + '='.repeat(60));
        console.error('TROUBLESHOOTING GUIDE');
        console.error('='.repeat(60));
        
        console.error('\n📍 For LOCAL MongoDB:');
        console.error('1. Make sure mongod.exe is running on localhost:27017');
        console.error('2. On Windows, use: net start MongoDB');
        console.error('3. Or run directly: mongod.exe --dbpath C:\\data\\db');
        console.error('4. Wait 5-10 seconds for MongoDB to fully initialize');
        
        console.error('\n☁️  RECOMMENDED - Use MongoDB Atlas (Cloud) instead:');
        console.error('1. Create free account at https://www.mongodb.com/cloud/atlas');
        console.error('2. Create a free tier cluster');
        console.error('3. Get connection string like:');
        console.error('   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/designer-portfolio');
        console.error('4. Update MONGODB_URI in .env file');
        console.error('5. Run "node setup-db.js" again');
        
        console.error('\n🔍 If local MongoDB won\'t start:');
        console.error('- Check Event Viewer for MongoDB error logs');
        console.error('- Verify MongoDB installation: mongod --version');
        console.error('- Reinstall MongoDB if binary is corrupted');
        console.error('- Check firewall isn\'t blocking port 27017');
        
        console.error('\n📝 Current configuration:');
        console.error('   URI:', MONGODB_URI);
        console.error('   Error:', error.message);
        console.error('\n' + '='.repeat(60));
        process.exit(1);
    }
}

// Run setup
setupDatabase();
