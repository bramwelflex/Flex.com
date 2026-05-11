# Testing Guide 🧪

Complete guide to test all features of the Designer Portfolio.

## Frontend Testing

### Manual Testing Checklist

#### Navigation & UI
- [ ] Navbar appears on scroll
- [ ] Navbar links scroll smoothly
- [ ] Active navigation state updates
- [ ] Mobile menu works on mobile devices
- [ ] All sections are responsive
- [ ] Dark theme displays correctly

#### Hero Section
- [ ] Background image loads
- [ ] Parallax effect works on scroll
- [ ] CTA buttons are clickable
- [ ] Hero text animations play

#### Portfolio Grid
- [ ] All portfolio items display
- [ ] Portfolio filter buttons work
- [ ] Hover effects trigger
- [ ] Images load correctly
- [ ] Lightbox opens on click (if enabled)

#### Services Section
- [ ] All service cards display
- [ ] Service cards are responsive
- [ ] Hover animations work
- [ ] Icons load correctly

#### Booking System
- [ ] Booking form appears
- [ ] Date picker works
- [ ] Weekend dates are blocked
- [ ] Past dates are blocked
- [ ] Service dropdown works
- [ ] Form validation shows errors

#### Newsletter
- [ ] Email input accepts text
- [ ] Submit button works
- [ ] Success message appears
- [ ] Form clears after submission

#### Contact Form
- [ ] All fields accept input
- [ ] Form validation works
- [ ] Error messages display
- [ ] Success notification appears

#### Chat Assistant
- [ ] Chat widget opens/closes
- [ ] Messages appear in chat
- [ ] Bot responds to messages
- [ ] Chat history displays
- [ ] Click outside closes chat

#### Testimonials
- [ ] Carousel rotates automatically
- [ ] Navigation buttons work
- [ ] Text is readable
- [ ] Images load

#### Footer
- [ ] Social links work
- [ ] Contact info displays
- [ ] Footer is sticky
- [ ] Links open in new tabs

### Browser Testing

Test in all browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Chrome
- ✅ Mobile Safari

### Mobile Testing

Test on all breakpoints:
- [ ] 1920px (Desktop)
- [ ] 1280px (Laptop)
- [ ] 768px (Tablet)
- [ ] 480px (Mobile)
- [ ] 320px (Small phone)

## API Testing

### Setup

1. **Start Backend**
   ```bash
   npm run dev
   ```

2. **Verify Server Running**
   ```bash
   curl http://localhost:5000/api/health
   ```
   
   Should return:
   ```json
   {"status": "Backend is running!", "timestamp": "..."}
   ```

### Postman Collection

Create Postman collection with these requests:

#### 1. Authentication

**Register User**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

Expected Response: 201
```json
{
  "user": {
    "_id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "role": "user"
  }
}
```

**Login User**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Expected Response: 200
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "email": "test@example.com",
    "role": "user"
  }
}
```

#### 2. Bookings

**Create Booking**
```
POST http://localhost:5000/api/bookings
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "service": "web",
  "date": "2026-05-20",
  "notes": "Looking for e-commerce site"
}
```

Expected Response: 201
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "service": "web",
  "date": "2026-05-20",
  "status": "pending",
  "createdAt": "..."
}
```

**Get All Bookings** (Admin only)
```
GET http://localhost:5000/api/bookings
Authorization: Bearer <token>
```

**Get Single Booking**
```
GET http://localhost:5000/api/bookings/<id>
```

**Update Booking Status**
```
PATCH http://localhost:5000/api/bookings/<id>/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Delete Booking**
```
DELETE http://localhost:5000/api/bookings/<id>
Authorization: Bearer <token>
```

#### 3. Contact Form

**Submit Contact**
```
POST http://localhost:5000/api/contact
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Website Inquiry",
  "message": "I would like to discuss a project"
}
```

Expected Response: 201
```json
{
  "_id": "...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Website Inquiry",
  "status": "new",
  "createdAt": "..."
}
```

**Get All Messages** (Admin)
```
GET http://localhost:5000/api/contact
Authorization: Bearer <token>
```

#### 4. Newsletter

**Subscribe**
```
POST http://localhost:5000/api/newsletter/subscribe
Content-Type: application/json

{
  "email": "subscriber@example.com"
}
```

**Get Subscribers** (Admin)
```
GET http://localhost:5000/api/newsletter
Authorization: Bearer <token>
```

**Get Stats**
```
GET http://localhost:5000/api/newsletter/stats/overview
```

#### 5. Payments

**Create Payment Intent**
```
POST http://localhost:5000/api/payments/create-intent
Content-Type: application/json

{
  "service": "web",
  "amount": 2000,
  "email": "customer@example.com"
}
```

**Confirm Payment**
```
POST http://localhost:5000/api/payments/confirm
Content-Type: application/json

{
  "paymentIntentId": "pi_...",
  "bookingId": "...",
  "email": "customer@example.com"
}
```

### cURL Testing

```bash
# Health check
curl -X GET http://localhost:5000/api/health

# Create booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "service": "branding",
    "date": "2026-06-15"
  }'

# Subscribe to newsletter
curl -X POST http://localhost:5000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "subscriber@example.com"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@designer.com",
    "password": "admin123"
  }'
```

### API Response Validation

For each endpoint, verify:
- ✅ Status code (200, 201, 400, 404, 500)
- ✅ Response headers (Content-Type, etc.)
- ✅ Response body structure
- ✅ Data types
- ✅ Error messages
- ✅ Validation errors

### Load Testing

Use Apache Bench or WRK:

```bash
# Test booking endpoint
ab -n 100 -c 10 http://localhost:5000/api/bookings

# Test newsletter
wrk -t4 -c100 -d30s http://localhost:5000/api/newsletter/stats/overview
```

## Database Testing

### MongoDB Connection

```bash
# Connect to MongoDB
mongo

# Switch to database
use designer-portfolio

# Check collections
show collections

# Count documents
db.users.countDocuments()
db.bookings.countDocuments()
db.contact.countDocuments()
db.newsletters.countDocuments()
db.payments.countDocuments()

# View sample document
db.bookings.findOne()

# View all bookings
db.bookings.find().pretty()
```

### Database Queries

```javascript
// Find pending bookings
db.bookings.find({ status: "pending" })

// Find bookings by service
db.bookings.find({ service: "web" })

// Find new messages
db.contact.find({ status: "new" })

// Count subscribers
db.newsletters.countDocuments({ subscribed: true })

// Find failed payments
db.payments.find({ status: "failed" })
```

## Email Testing

### Test Email Sending

1. **Create Booking** (triggers booking confirmation email)
   ```bash
   curl -X POST http://localhost:5000/api/bookings \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test",
       "email": "your-email@gmail.com",
       "service": "web",
       "date": "2026-06-20"
     }'
   ```

2. **Check Email** - Should receive booking confirmation

3. **Subscribe Newsletter** (triggers welcome email)
   ```bash
   curl -X POST http://localhost:5000/api/newsletter/subscribe \
     -H "Content-Type: application/json" \
     -d '{"email": "your-email@gmail.com"}'
   ```

4. **Submit Contact Form** (triggers confirmation email)
   ```bash
   curl -X POST http://localhost:5000/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test",
       "email": "your-email@gmail.com",
       "subject": "Test Subject",
       "message": "Test message"
     }'
   ```

### Email Test Checklist

- [ ] Booking confirmation received
- [ ] Newsletter welcome received
- [ ] Contact confirmation received
- [ ] Email contains correct information
- [ ] Links work in email
- [ ] Email displays well on mobile
- [ ] HTML formatting correct

## Integration Testing

### Complete User Flow

1. **Visit Website**
   - [ ] Page loads
   - [ ] All sections visible
   - [ ] No console errors

2. **Submit Contact Form**
   - [ ] Form submits successfully
   - [ ] Success message appears
   - [ ] Email received

3. **Subscribe Newsletter**
   - [ ] Form submits
   - [ ] Success message appears
   - [ ] Welcome email received

4. **Book Service**
   - [ ] Fill booking form
   - [ ] Select date/service
   - [ ] Confirmation received
   - [ ] Email sent
   - [ ] Booking in database

5. **Make Payment** (if Stripe setup)
   - [ ] Payment form appears
   - [ ] Card accepted
   - [ ] Payment confirmed
   - [ ] Booking updated

### Admin Flow

1. **Login to Admin Dashboard**
   - [ ] Login successful
   - [ ] Token stored
   - [ ] Dashboard loads

2. **View Bookings**
   - [ ] All bookings display
   - [ ] Can view details
   - [ ] Can change status

3. **View Messages**
   - [ ] All messages display
   - [ ] Can mark as read
   - [ ] Can delete

4. **View Subscribers**
   - [ ] Subscriber count correct
   - [ ] Stats display

5. **View Payments**
   - [ ] Payment history shows
   - [ ] Amounts correct

## Security Testing

### OWASP Top 10

- [ ] SQL Injection - N/A (using Mongoose)
- [ ] XSS Protection - Check sanitized inputs
- [ ] CSRF Protection - Verify token validation
- [ ] Broken Auth - Test invalid credentials
- [ ] Data Exposure - Verify sensitive data encrypted
- [ ] Access Control - Test admin-only endpoints
- [ ] Known Vulnerabilities - `npm audit`
- [ ] Weak Cryptography - Check bcrypt usage

### Test Invalid Inputs

```bash
# Invalid email
curl -X POST http://localhost:5000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "not-an-email"}'

# Missing required fields
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'

# Invalid date
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "service": "web",
    "date": "not-a-date"
  }'
```

## Performance Testing

### Frontend Metrics

```bash
# Run Lighthouse audit
lighthouse https://yourdomain.com --view
```

Check:
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3s
- [ ] Lighthouse Score > 90

### Backend Performance

```bash
# Response time test
time curl -X GET http://localhost:5000/api/health

# Concurrent requests
ab -n 1000 -c 50 http://localhost:5000/api/health
```

## Test Report Template

```markdown
# Test Report - Designer Portfolio
Date: YYYY-MM-DD
Tester: Name

## Test Results

### Frontend
- [ ] PASS: Navigation works
- [ ] PASS: Forms submit
- [ ] PASS: Responsive
- [ ] FAIL: Chat widget shows errors

### Backend
- [ ] PASS: API endpoints respond
- [ ] PASS: Database saves data
- [ ] PASS: Email sends
- [ ] FAIL: Payment endpoint timeout

### Issues Found
1. Chat widget throws error on mobile
2. Payment endpoint slow (>5s response)

### Recommendations
- Debug chat widget on mobile
- Add caching to payment endpoint
- Optimize database queries

## Sign-off
Tester: ___________
Date: ___________
```

## Continuous Testing

Setup automated tests with:
- Jest (Unit tests)
- Supertest (API tests)
- Cypress (E2E tests)
- Lighthouse CI (Performance)

Example Jest test:
```javascript
// tests/api.test.js
describe('Booking API', () => {
  it('should create booking', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .send({
        name: 'Test',
        email: 'test@example.com',
        service: 'web',
        date: '2026-06-15'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.service).toBe('web');
  });
});
```

## Test Checklist Summary

- [ ] All forms work
- [ ] API responds correctly
- [ ] Database saves data
- [ ] Emails send
- [ ] Admin dashboard functions
- [ ] Responsive design works
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security validated
- [ ] All browsers tested

Happy testing! 🧪✨
