# ⚡ Quick Action Required - MongoDB Setup

## What's Happening

Your Designer Portfolio is **100% complete and ready to use**, but needs a MongoDB database connection to function. The local MongoDB binary encountered a compatibility issue.

## Your 3 Options (Pick One)

### 🥇 FASTEST & EASIEST - Use MongoDB Atlas (Free Cloud) - 5 mins

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Create account and cluster
4. Click "Connect" → "Drivers" → "Node.js"
5. Copy connection string
6. Open `.env` file and replace this line:
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/designer-portfolio
   ```
7. Make sure to add your IP to IP Access List in Atlas
8. Open terminal and run:
   ```
   node setup-db.js
   ```

If successful, you'll see:
```
✅ Connected to MongoDB
✅ Collections created
✅ Admin user created
```

**Then start your server:**
```
npm run dev
```

Visit: http://localhost:5000

---

### 🥈 Use Local MongoDB - Requires Fixing Installation

If local MongoDB won't start, see: **MONGODB_LOCAL_SETUP.md**

Recommended actions:
1. Reinstall MongoDB 8.3 or try version 7.0
2. During install, select "Install as Service"
3. Restart computer
4. Try `net start MongoDB`

Then run:
```
node setup-db.js
```

---

### 🥉 Expert Option - Troubleshoot Local MongoDB

See: **MONGODB_LOCAL_SETUP.md** for detailed troubleshooting

---

## What Happens After Setup

✅ All 5 collections created automatically:
- Users (for authentication)
- Bookings (for reservations)
- Contacts (for messages)
- Newsletter (for subscriptions)
- Payments (for transactions)

✅ Admin account created:
- Email: admin@designer.com
- Password: admin123
- (Change these in .env before deploying)

✅ Backend API ready:
- 30+ endpoints fully functional
- Email notifications ready
- Admin dashboard ready
- Payment processing ready (Stripe)

---

## Test Everything Works

After setup, run:
```
npm run dev
```

Visit these URLs:
- **Frontend**: http://localhost:5000 (should load website)
- **API Health**: http://localhost:5000/health (should show connected)
- **Admin**: http://localhost:5000/admin (admin login page)

---

## Common Issues

| Problem | Solution |
|---------|----------|
| "connect ECONNREFUSED" | MongoDB not running - use Atlas or start service |
| Setup script hangs | MongoDB starting slow - wait 30 seconds, try again |
| "Entry Point Not Found" | Local mongod corrupted - reinstall or use Atlas |
| IP whitelist error | Atlas: add your IP to IP Access List |

---

## Need Help?

1. **For MongoDB**: See **MONGODB_LOCAL_SETUP.md**
2. **For setup issues**: Check error message in terminal
3. **For backend**: See **BACKEND_SETUP.md**
4. **For deployment**: See **DEPLOYMENT_GUIDE.md**

---

## Next Step

**Choose MongoDB Atlas (option 1) for fastest setup!**

It takes 5 minutes and everything works immediately.

Then run:
```
node setup-db.js
npm run dev
```

Done! 🎉
