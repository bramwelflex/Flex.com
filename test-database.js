#!/usr/bin/env node

/**
 * Database Connection Diagnostic Tool
 * Run this to diagnose MongoDB connection issues
 */

require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns').promises;

console.log('\n🔍 DATABASE DIAGNOSTIC TOOL\n');
console.log('=' .repeat(60));

// Check environment
console.log('\n📋 Environment Check:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   MONGODB_URI configured: ${!!process.env.MONGODB_URI ? 'Yes' : 'No'}`);

if (process.env.MONGODB_URI) {
    const uri = process.env.MONGODB_URI;
    const masked = uri.substring(0, 30) + '...' + uri.substring(uri.length - 20);
    console.log(`   URI: ${masked}`);
}

// Parse MongoDB connection string
const parseMongoUri = (uri) => {
    try {
        const url = new URL(uri);
        return {
            protocol: url.protocol,
            host: url.hostname,
            port: url.port || 27017,
            database: url.pathname.split('/')[1]
        };
    } catch (e) {
        return null;
    }
};

// Test DNS resolution
const testDnsResolution = async () => {
    console.log('\n🌐 DNS Resolution Test:');
    
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/designer-portfolio';
    const parsed = parseMongoUri(uri);
    
    if (!parsed) {
        console.log('   ❌ Could not parse MongoDB URI');
        return false;
    }
    
    try {
        const addresses = await dns.resolve4(parsed.host);
        console.log(`   ✅ DNS resolved: ${parsed.host}`);
        console.log(`   IP addresses: ${addresses.join(', ')}`);
        return true;
    } catch (error) {
        console.log(`   ❌ DNS resolution failed: ${error.message}`);
        console.log('   💡 Try: Change DNS to 8.8.8.8 or use mobile hotspot');
        return false;
    }
};

// Test MongoDB connection
const testConnection = async () => {
    console.log('\n🔗 MongoDB Connection Test:');
    
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 5000,
            socketTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000
        };
        
        const connection = await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb://localhost:27017/designer-portfolio',
            options
        );
        
        console.log('   ✅ Connected to MongoDB!');
        console.log(`   Database: ${connection.connection.db.databaseName}`);
        
        // Test write
        console.log('\n📝 Write Test:');
        const TestSchema = new mongoose.Schema({ test: String });
        const TestModel = mongoose.model('TestConnection', TestSchema);
        
        try {
            const result = await TestModel.create({ test: 'diagnostic' });
            console.log('   ✅ Write successful');
            
            // Clean up
            await TestModel.deleteOne({ _id: result._id });
            console.log('   ✅ Cleanup successful');
        } catch (writeError) {
            console.log(`   ❌ Write failed: ${writeError.message}`);
        }
        
        await mongoose.connection.close();
        return true;
    } catch (error) {
        console.log(`   ❌ Connection failed: ${error.message}`);
        
        if (error.message.includes('buffering timed out')) {
            console.log('\n💡 DIAGNOSIS: MongoDB Atlas unreachable');
            console.log('   Solution 1: Switch to mobile hotspot');
            console.log('   Solution 2: Change DNS to 8.8.8.8');
            console.log('   Solution 3: Use local MongoDB');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 DIAGNOSIS: Connection refused (local MongoDB not running?)');
            console.log('   Start MongoDB: mongod');
        }
        
        return false;
    }
};

// Main execution
(async () => {
    const dnsOk = await testDnsResolution();
    const mongoOk = await testConnection();
    
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   DNS Resolution: ${dnsOk ? '✅' : '❌'}`);
    console.log(`   MongoDB Connection: ${mongoOk ? '✅' : '❌'}`);
    
    if (mongoOk) {
        console.log('\n✨ All tests passed! Database is ready.\n');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some tests failed. Check solutions above.\n');
        process.exit(1);
    }
})();
