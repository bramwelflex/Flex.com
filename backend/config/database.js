const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/designer-portfolio';
        
        console.log('🔄 Attempting MongoDB connection...');
        console.log(`📍 URI: ${mongoUri.substring(0, 50)}...`);

        // Set connection options with timeouts
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 10000,
            serverSelectionTimeoutMS: 10000,
            retryWrites: true,
            w: 'majority'
        };

        const connection = await mongoose.connect(mongoUri, options);
        
        console.log('✅ MongoDB connected successfully!');
        console.log(`   Database: ${connection.connection.db.databaseName}`);
        
        return connection;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:');
        console.error(`   Error: ${error.message}`);
        
        // Provide diagnostic information
        if (error.message.includes('buffering timed out')) {
            console.error('\n⚠️  DIAGNOSIS: MongoDB Atlas is unreachable (network/DNS issue)');
            console.error('   Possible causes:');
            console.error('   1. WiFi router DNS blocking SRV records');
            console.error('   2. Firewall blocking MongoDB port 27017');
            console.error('   3. IP not whitelisted in MongoDB Atlas');
            console.error('\n💡 SOLUTIONS:');
            console.error('   1. Connect to different WiFi/mobile hotspot');
            console.error('   2. Change DNS to 8.8.8.8 (Google DNS)');
            console.error('   3. Install local MongoDB');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.error('\n⚠️  DIAGNOSIS: Cannot connect to MongoDB (likely local MongoDB not running)');
            console.error('   Start MongoDB with: mongod');
        }
        
        console.error('\n🔧 Current configuration:');
        console.error(`   NODE_ENV: ${process.env.NODE_ENV}`);
        console.error(`   MONGODB_URI provided: ${!!process.env.MONGODB_URI}`);
        
        // Don't crash - continue with warning
        console.warn('\n⚠️  WARNING: Proceeding without database (API health check will work)');
        console.warn('   All database operations will fail until connection is restored\n');
        
        return null;
    }
};

// Check connection status
const isConnected = () => {
    return mongoose.connection.readyState === 1;
};

module.exports = {
    connectDatabase,
    isConnected
};
