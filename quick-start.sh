#!/bin/bash
# Designer Portfolio - Quick Start Script for Linux/Mac
# This script helps you get started with the Designer Portfolio

echo ""
echo "========================================"
echo "  Designer Portfolio - Quick Start"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "[✓] Node.js is installed ($(node --version))"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed!"
    echo "Please install Node.js with npm"
    exit 1
fi

echo "[✓] npm is installed ($(npm --version))"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ""
    echo "[!] .env file not found"
    echo "Creating .env file from template..."
    
    cat > .env << 'EOF'
# Backend Configuration
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

# Stripe Configuration
STRIPE_PUBLIC_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Admin Credentials
ADMIN_PASSWORD=admin123

# CORS Origins
CORS_ORIGIN=http://localhost:3000,http://localhost:8000,http://localhost:5000
EOF
    
    echo "[✓] .env file created"
    echo "[!] Please update .env with your credentials"
else
    echo "[✓] .env file exists"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo ""
    echo "[!] Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] npm install failed!"
        exit 1
    fi
    echo "[✓] Dependencies installed"
else
    echo "[✓] Dependencies already installed"
fi

# Check if MongoDB is running
echo ""
echo "[?] Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    mongosh --eval "exit" --quiet 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "[✓] MongoDB is running"
    else
        echo "[!] MongoDB is not running"
        echo "    Start MongoDB with: mongod"
    fi
else
    echo "[!] mongosh not found, skipping MongoDB check"
    echo "    Make sure MongoDB is running on localhost:27017"
fi

echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Ensure MongoDB is running"
echo "   Start with: mongod"
echo ""
echo "2. Start the backend server"
echo "   Run: npm run dev"
echo ""
echo "3. Open frontend in browser"
echo "   Open: index.html"
echo ""
echo "4. Access admin dashboard"
echo "   Open: admin/login.html"
echo "   Email: admin@designer.com"
echo "   Password: admin123"
echo ""
echo "Documentation:"
echo "- BACKEND_SETUP.md - Backend configuration"
echo "- DEPLOYMENT_GUIDE.md - Production deployment"
echo "- TESTING_GUIDE.md - Testing procedures"
echo "- FINAL_README.md - Complete documentation"
echo ""
echo "Happy coding! 🚀"
echo ""
