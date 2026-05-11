# Backend Setup Guide 🚀

Complete guide to set up and run the Designer Portfolio backend system.

## Prerequisites

- Node.js 14+ and npm
- MongoDB (local or Atlas)
- Stripe account (for payments)
- Gmail account (for email)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs:
- **express** - Web server framework
- **mongoose** - MongoDB ODM
- **nodemailer** - Email service
- **stripe** - Payment processing
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/designer-portfolio

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=hello@designer.com
ADMIN_EMAIL=admin@designer.com

# Stripe
STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# JWT
JWT_SECRET=your-super-secret-key

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:8000,http://localhost:5000
```

### 3. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB
# Start MongoDB
mongod

# Verify connection
mongo
```

#### Option B: MongoDB Atlas (Cloud)
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update MONGODB_URI in .env
```

### 4. Setup Gmail for Email Service

1. Enable 2-factor authentication on your Gmail account
2. Generate App Password:
   - Go to myaccount.google.com/apppasswords
   - Select Mail and Windows Computer
   - Copy generated password
3. Add to .env:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

### 5. Setup Stripe (Optional - for Payments)

1. Go to https://stripe.com
2. Create account and go to Dashboard
3. Copy keys from Developers > API Keys
4. Add to .env:
   ```env
   STRIPE_PUBLIC_KEY=pk_test_xxx
   STRIPE_SECRET_KEY=sk_test_xxx
   ```

### 6. Start Backend Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB connected
📧 Email Service: gmail
💳 Stripe: Configured
```

### 7. Create Admin User

Run in terminal or Postman:
```bash
curl -X POST http://localhost:5000/api/auth/setup-admin
```

Response:
```json
{
  "message": "Admin user created",
  "user": {
    "username": "admin",
    "email": "admin@designer.com"
  }
}
```

### 8. Access Admin Dashboard

1. Open `admin/login.html` in browser
2. Login with:
   - Email: `admin@designer.com`
   - Password: `admin123`

## API Endpoints

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get single booking
- `PATCH /api/bookings/:id/status` - Update status
- `DELETE /api/bookings/:id` - Delete booking

### Contact Forms
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages
- `PATCH /api/contact/:id/read` - Mark as read
- `DELETE /api/contact/:id` - Delete message

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe
- `GET /api/newsletter` - Get all subscribers
- `GET /api/newsletter/stats/overview` - Get stats

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments` - Get all payments

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/setup-admin` - Setup admin (one-time)

## Testing APIs

### Using cURL

```bash
# Create Booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "service": "web",
    "date": "2026-05-20"
  }'

# Subscribe Newsletter
curl -X POST http://localhost:5000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Submit Contact
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "subject": "Website Inquiry",
    "message": "I want to book a service"
  }'
```

### Using Postman

1. Import the API endpoints
2. Set base URL: `http://localhost:5000/api`
3. Test each endpoint

## Frontend Integration

All forms automatically connect to backend:

1. **Booking Form** - Saves bookings to database
2. **Contact Form** - Saves messages to database
3. **Newsletter** - Saves emails to database
4. **Payment** - Processes payments with Stripe

The `js/api.js` file handles all API calls.

## Database Structure

### Users Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: 'admin' | 'user',
  createdAt: Date
}
```

### Bookings Collection
```javascript
{
  name: String,
  email: String,
  service: 'branding' | 'web' | 'ui' | 'consultation',
  date: Date,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  notes: String,
  createdAt: Date
}
```

### Contact Collection
```javascript
{
  name: String,
  email: String,
  subject: String,
  message: String,
  status: 'new' | 'read' | 'replied',
  createdAt: Date
}
```

### Newsletter Collection
```javascript
{
  email: String,
  firstName: String,
  lastName: String,
  subscribed: Boolean,
  tags: [String],
  createdAt: Date
}
```

### Payments Collection
```javascript
{
  bookingId: ObjectId,
  stripePaymentId: String,
  amount: Number,
  currency: String,
  status: 'pending' | 'succeeded' | 'failed',
  email: String,
  service: String,
  createdAt: Date
}
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Make sure MongoDB is running
```bash
# Windows
mongod

# Mac/Linux
brew services start mongodb-community
```

### Email Not Sending
```
Error: Invalid login
```
**Solution:** 
- Use app password (not regular password)
- Enable 2FA on Gmail
- Check EMAIL_USER and EMAIL_PASSWORD in .env

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Update CORS_ORIGIN in .env with your frontend URL

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** 
```bash
# Find process on port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

## Security Tips

1. **Change JWT_SECRET** in production
2. **Change ADMIN_PASSWORD** in production
3. **Use environment variables** for sensitive data
4. **Enable HTTPS** in production
5. **Setup SSL certificates**
6. **Rate limit endpoints**
7. **Validate all inputs**
8. **Use strong passwords**

## Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_atlas_url
heroku config:set STRIPE_SECRET_KEY=sk_xxx
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Deploy to AWS/DigitalOcean

1. Create server instance
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies
5. Configure environment variables
6. Setup PM2 for process management
7. Setup Nginx reverse proxy
8. Enable SSL with Let's Encrypt

## Next Steps

1. ✅ Backend running
2. ✅ Admin dashboard accessible
3. ✅ Email notifications working
4. ✅ Payments configured (optional)
5. 📊 Setup analytics
6. 📱 Create mobile app
7. 🎯 Implement CRM features

## Support

For issues:
1. Check logs: `npm run dev`
2. Test endpoints with cURL/Postman
3. Verify .env configuration
4. Check MongoDB connection
5. Review error messages

Happy coding! 🚀
