@echo off
REM FLEXTECH Portfolio - Quick Start Script for Windows
REM This script helps you get started with the FLEXTECH Portfolio

echo.
echo ========================================
echo   FLEXTECH Portfolio - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [✓] Node.js is installed

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed!
    echo Please install Node.js with npm
    pause
    exit /b 1
)

echo [✓] npm is installed

REM Check if .env file exists
if not exist ".env" (
    echo.
    echo [!] .env file not found
    echo Creating .env file from template...
    
    (
        echo # Backend Configuration
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # Database
        echo MONGODB_URI=mongodb://localhost:27017/designer-portfolio
        echo.
        echo # Email Configuration
        echo EMAIL_SERVICE=gmail
        echo EMAIL_USER=your-email@gmail.com
        echo EMAIL_PASSWORD=your-app-password
        echo EMAIL_FROM=hello@designer.com
        echo ADMIN_EMAIL=admin@designer.com
        echo.
        echo # Stripe Configuration
        echo STRIPE_PUBLIC_KEY=pk_test_your_key_here
        echo STRIPE_SECRET_KEY=sk_test_your_key_here
        echo.
        echo # JWT Secret
        echo JWT_SECRET=your-super-secret-jwt-key-change-in-production
        echo.
        echo # Admin Credentials
        echo ADMIN_PASSWORD=admin123
        echo.
        echo # CORS Origins
        echo CORS_ORIGIN=http://localhost:3000,http://localhost:8000,http://localhost:5000
    ) > .env
    
    echo [✓] .env file created
    echo [!] Please update .env with your credentials
    pause
) else (
    echo [✓] .env file exists
)

REM Check if node_modules exists
if not exist "node_modules\" (
    echo.
    echo [!] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
    echo [✓] Dependencies installed
) else (
    echo [✓] Dependencies already installed
)

REM Check if MongoDB is running
echo.
echo [?] Checking MongoDB connection...
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/designer-portfolio', {useNewUrlParser: true}).then(() => {console.log('[✓] MongoDB is running'); process.exit(0)}).catch((err) => {console.log('[!] MongoDB is not running'); console.log('    Start MongoDB with: mongod'); process.exit(1)})" >nul 2>&1

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Ensure MongoDB is running
echo    Start with: mongod
echo.
echo 2. Start the backend server
echo    Run: npm run dev
echo.
echo 3. Open frontend in browser
echo    Open: index.html
echo.
echo 4. Access admin dashboard
echo    Open: admin/login.html
echo    Email: admin@designer.com
echo    Password: admin123
echo.
echo Documentation:
echo - BACKEND_SETUP.md - Backend configuration
echo - DEPLOYMENT_GUIDE.md - Production deployment
echo - TESTING_GUIDE.md - Testing procedures
echo - FINAL_README.md - Complete documentation
echo.
echo Happy coding! 🚀
echo.

pause
