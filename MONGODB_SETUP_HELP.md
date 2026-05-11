# MongoDB Setup - Connection Issues & Solutions

## Current Status
❌ Connection Error: MongoDB Atlas network unreachable

## Two Options to Fix

### Option 1: Use MongoDB Atlas (Cloud) - RECOMMENDED ✅

**Steps:**
1. Go to https://cloud.mongodb.com
2. Login to your account
3. Click "Clusters" in sidebar
4. Find your cluster "cluster0"
5. Click "Connect"
6. Click "Drivers"
7. Select Node.js version 5.5 or later
8. Copy the connection string
9. In your `.env`, ensure:
   ```
   MONGODB_URI=mongodb+srv://bramflex46_db_user:Flextechnologies@cluster0.2diq8h9.mongodb.net/designer-portfolio
   ```
10. **IMPORTANT**: Add your current IP to the IP Whitelist:
    - Go to Network Access
    - Click "Add IP Address"
    - Select "Add Current IP Address"
    - Or use "0.0.0.0/0" to allow all IPs (less secure)
11. Click Confirm
12. Run: `node setup-db.js`

### Option 2: Use Local MongoDB

1. **Start MongoDB Service:**
   ```powershell
   # Windows - Start MongoDB service
   net start MongoDB
   
   # Or if installed via Chocolatey:
   mongod
   ```

2. **Update .env:**
   ```
   MONGODB_URI=mongodb://localhost:27017/designer-portfolio
   ```

3. **Run setup:**
   ```bash
   node setup-db.js
   ```

## Current .env Connection Details
- **User**: bramflex46_db_user
- **Cluster**: cluster0.2diq8h9
- **Database**: designer-portfolio

## To Check Your IP in MongoDB Atlas:
1. Go to https://cloud.mongodb.com
2. Click "Network Access" in left sidebar
3. Look at the IP Whitelist
4. Add your current IP if not there

## Quick Fix Commands

**If MongoDB Atlas:**
```bash
# After whitelisting your IP, run:
node setup-db.js
```

**If Local MongoDB:**
```bash
# Start MongoDB first, then:
node setup-db.js
```

## Need Help?
- Check MongoDB Atlas connection status: https://cloud.mongodb.com
- Verify your IP is whitelisted
- Check .env MONGODB_URI is correct
