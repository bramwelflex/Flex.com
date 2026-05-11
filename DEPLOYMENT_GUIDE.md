# Deployment Guide 🌐

Complete guide to deploy your Designer Portfolio to production.

## Frontend Deployment

### Option 1: Vercel (Recommended)

**Advantages:**
- Free tier included
- Automatic deployments from Git
- Built-in SSL
- Lightning-fast CDN
- Serverless functions support

**Steps:**

1. **Sign up at Vercel**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure**
   - Project name: designer-portfolio
   - Framework: Other (for vanilla JS)
   - Root directory: ./
   - Build: Skip
   - Output: ./

4. **Update API URL**
   - Edit `js/api.js`
   - Change `process.env.API_URL` to production backend URL

### Option 2: Netlify

1. **Sign up at netlify.com**

2. **Connect Git repository**
   - Link GitHub/GitLab account
   - Select FLEX.COM repository
   - Deploy!

3. **Configure**
   - Build command: (leave empty)
   - Publish directory: ./

### Option 3: GitHub Pages

```bash
# Create gh-pages branch
git checkout --orphan gh-pages
git reset --hard
git commit --allow-empty -m "Initial commit"
git push -u origin gh-pages

# Deploy
git checkout main
git push origin main
```

## Backend Deployment

### Option 1: Render (Recommended)

**Setup:**

1. Go to https://render.com
2. Create account
3. Click "New +"
4. Select "Web Service"
5. Connect Git repository

**Configuration:**

- **Build Command:** `npm install`
- **Start Command:** `node backend/server.js`
- **Environment Variables:**
  ```
  MONGODB_URI=your_atlas_connection
  EMAIL_USER=your_email@gmail.com
  EMAIL_PASSWORD=your_app_password
  STRIPE_SECRET_KEY=sk_test_xxx
  JWT_SECRET=production_secret_key
  ADMIN_EMAIL=admin@yoursite.com
  ADMIN_PASSWORD=secure_password
  PORT=5000
  ```

**Deploy:** Render auto-deploys on git push

### Option 2: Heroku

```bash
# Install Heroku CLI
npm install -g heroku
heroku login

# Create app
heroku create your-app-name

# Add MongoDB Atlas
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/designer-portfolio

# Set all env vars
heroku config:set \
  EMAIL_USER=your_email@gmail.com \
  EMAIL_PASSWORD=your_app_password \
  STRIPE_SECRET_KEY=sk_test_xxx \
  JWT_SECRET=production_secret_key \
  ADMIN_EMAIL=admin@yoursite.com \
  ADMIN_PASSWORD=secure_password

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option 3: AWS (EC2)

1. **Create EC2 Instance**
   - OS: Ubuntu 20.04
   - Type: t2.micro (free tier)
   - Security: Allow ports 80, 443, 22, 5000

2. **Connect & Setup**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   
   # Update system
   sudo apt-get update
   sudo apt-get upgrade -y
   
   # Install Node.js
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   sudo apt-get install -y mongodb
   
   # Clone repository
   git clone https://github.com/your-repo/FLEX.COM
   cd FLEX.COM
   npm install
   ```

3. **Setup Environment**
   ```bash
   sudo nano .env
   # Add all environment variables
   ```

4. **Run with PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start backend/server.js --name "designer-api"
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx**
   ```bash
   sudo apt-get install -y nginx
   
   # Configure
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add:
   ```nginx
   server {
       listen 80 default_server;
       server_name _;
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
       }
       
       location / {
           root /var/www/html;
           try_files $uri /index.html;
       }
   }
   ```
   
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup SSL (Let's Encrypt)**
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Database Deployment

### MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 free tier)
4. Create database user
5. Add IP whitelist (0.0.0.0/0 for any)
6. Get connection string
7. Add to environment variables

**Connection String Format:**
```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

## Custom Domain Setup

### 1. Register Domain
- Godaddy, Namecheap, or similar

### 2. Update DNS Records

**For Vercel Frontend:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For Render Backend:**
```
Type: A
Name: api
Value: Render-assigned IP
```

### 3. Update Frontend API URL

Edit `js/api.js`:
```javascript
const api = new PortfolioAPI(
    process.env.NODE_ENV === 'production' 
        ? 'https://api.yourdomain.com' 
        : 'http://localhost:5000/api'
);
```

## Environment Setup Checklist

### Frontend (.env or config)
- [ ] Production API URL
- [ ] Analytics ID (optional)
- [ ] Stripe public key
- [ ] Social media links

### Backend (.env)
- [ ] MongoDB URI (Atlas)
- [ ] EMAIL_USER (Gmail)
- [ ] EMAIL_PASSWORD (app password)
- [ ] STRIPE_SECRET_KEY
- [ ] JWT_SECRET (strong random string)
- [ ] ADMIN_EMAIL
- [ ] ADMIN_PASSWORD (strong)
- [ ] NODE_ENV=production
- [ ] CORS_ORIGIN (your domain)

## Performance Optimization

### Frontend
```bash
# Minify CSS/JS
npm install -g terser clean-css-cli

# Optimize images
npm install -g imagemin

# Build
npm run build
```

### Backend
- Enable gzip compression
- Setup Redis caching
- Use CDN for assets
- Implement rate limiting

### Database
- Add indexes to frequently queried fields
- Archive old data
- Setup backups
- Monitor performance

## Monitoring & Logs

### Render
- Built-in logs at dashboard
- Email alerts

### Vercel
- Analytics dashboard
- Real-time logs
- Error tracking

### AWS
```bash
# SSH into instance
ssh -i key.pem ubuntu@ip

# View app logs
pm2 logs

# View system logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Backup Strategy

### Database
```bash
# Backup MongoDB
mongodump --uri "mongodb+srv://username:password@cluster.mongodb.net/designer-portfolio"

# Restore
mongorestore --uri "mongodb+srv://username:password@cluster.mongodb.net" dump/
```

### Code
- Use Git for version control
- Tag releases: `git tag -a v1.0.0`
- Keep production branch clean

## Continuous Integration

### GitHub Actions (Auto-deploy)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Vercel
      run: |
        npm i -g vercel
        vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
    
    - name: Deploy to Render
      run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}
```

## Cost Breakdown

| Service | Tier | Cost |
|---------|------|------|
| Vercel Frontend | Free | $0 |
| Render Backend | Free | $0 |
| MongoDB Atlas | Free | $0 |
| Domain | Annual | $8-12 |
| SSL | Free | $0 |
| **Total** | **Starter** | **$8-12/year** |

Upgrade as you scale:
- Vercel Pro: $20/month
- Render Starter: $7/month
- MongoDB Pro: $9/month

## Post-Deployment Tasks

1. ✅ Test all APIs
2. ✅ Verify email sending
3. ✅ Test booking flow
4. ✅ Check payment processing
5. ✅ Verify admin dashboard
6. ✅ Setup monitoring
7. ✅ Enable backups
8. ✅ Setup custom domain
9. ✅ Optimize images
10. ✅ Run Lighthouse audit

## Troubleshooting Deployment

### Pages Not Loading
- Check DNS settings
- Verify domain CNAME/A records
- Check SSL certificate

### API Calls Failing
- Verify backend is running
- Check CORS settings
- Validate API URL in frontend

### Emails Not Sending
- Verify Gmail app password
- Check email configuration
- Test with SMTP
- Review backend logs

### Database Connection Error
- Check MongoDB connection string
- Verify whitelist IP
- Test connection locally

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- GitHub Actions: https://docs.github.com/en/actions

Happy deploying! 🚀
