# MongoDB Setup Guide

## Current Issue

The local MongoDB 8.3 installation is not starting due to a binary compatibility issue (exit code -1073741511 = "Entry Point Not Found"). This typically indicates a missing DLL dependency.

## Solutions (Ranked by Ease)

### ✅ Solution 1: Use MongoDB Atlas (Cloud) - RECOMMENDED

MongoDB Atlas is a cloud-based MongoDB service with a free tier that's perfect for development.

**Steps:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start Free" and create an account
3. Create a free M0 tier cluster
4. In Cluster Dashboard, click "Connect"
5. Select "Drivers" → "Node.js"
6. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/designer-portfolio`)
7. Update your `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/designer-portfolio
   ```
8. Make sure to:
   - Replace `username` and `password` with your MongoDB Atlas credentials
   - Add your IP address to the IP Access List in Atlas
   - Replace `/test` with `/designer-portfolio` in the connection string

9. Run setup:
   ```
   node setup-db.js
   ```

**Advantages:**
- No local installation required
- Automatic backups
- Accessible from anywhere
- Free tier is sufficient for development
- Works immediately

### ✅ Solution 2: Fix Local MongoDB Installation

If you want to use the local MongoDB installation, try these steps:

**Option A: Reinstall MongoDB**
1. Uninstall MongoDB from Control Panel → Programs and Features
2. Delete `C:\Program Files\MongoDB` directory
3. Delete `C:\data\db` directory
4. Download fresh MongoDB 8.3 from: https://www.mongodb.com/try/download/community
5. Run the installer with Administrator privileges
6. During installation, check "Install as a Service"
7. When installation completes, MongoDB should auto-start

**Option B: Start MongoDB Service Manually**
1. Open Services (services.msc)
2. Find "MongoDB Server (MongoDB)"
3. Right-click → Start
4. Run: `node setup-db.js`

**Option C: Start MongoDB Directly**
1. Open PowerShell as Administrator
2. Run:
   ```powershell
   & "C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath "C:\Program Files\MongoDB\Server\8.3\data"
   ```
3. Keep this terminal open
4. In a new terminal, run: `node setup-db.js`

### ✅ Solution 3: Use MongoDB Community Edition

Try a different MongoDB version that might be more compatible:

1. Uninstall current MongoDB
2. Download MongoDB Community 7.0 from: https://www.mongodb.com/try/download/community
3. Run installer as Administrator
4. Complete installation
5. Start MongoDB service: `net start MongoDB`
6. Run: `node setup-db.js`

## Verification

After setup completes successfully, you should see:
```
✅ Connected to MongoDB
✅ Users collection created
✅ Bookings collection created
✅ Contacts collection created
✅ Newsletter collection created
✅ Payments collection created
✅ Admin user created
```

## Testing the Connection

Run the backend server:
```
npm run dev
```

You should see:
```
🚀 Backend server running on http://localhost:5000
✅ MongoDB connected
```

## Troubleshooting

**If you see "connect ECONNREFUSED":**
- MongoDB is not running
- For local: Try restarting MongoDB service or running mongod.exe directly
- For Atlas: Check your connection string and IP whitelist

**If mongod.exe won't start:**
- Check Event Viewer (Windows Logs → Application) for errors
- Verify mongod.exe is not corrupted: Try `mongod.exe --version`
- Check firewall isn't blocking port 27017
- Try reinstalling MongoDB

**If you get timeout errors:**
- Wait longer for MongoDB to start (can take 10-30 seconds)
- For local: Let mongod terminal run in background
- For Atlas: Check internet connection

## Quick Reference

**MongoDB Atlas Connection String Format:**
```
mongodb+srv://username:password@cluster-name.xxxxx.mongodb.net/designer-portfolio
```

**Local MongoDB Connection String Format:**
```
mongodb://localhost:27017/designer-portfolio
```

## Next Steps

1. Choose either MongoDB Atlas (recommended) or fix local installation
2. Update `.env` with correct MONGODB_URI
3. Run: `node setup-db.js`
4. Run: `npm run dev` to start the backend
5. Visit: http://localhost:5000/health to verify connection

## Need Help?

- **MongoDB Atlas Support:** https://www.mongodb.com/support
- **MongoDB Documentation:** https://docs.mongodb.com
- **Community Forums:** https://www.mongodb.com/community/forums/
