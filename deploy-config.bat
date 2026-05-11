@echo off
REM Deployment Configuration Script
REM Run this after deploying to update your API URL

setlocal enabledelayedexpansion

echo.
echo ========================================
echo DESIGNER PORTFOLIO - DEPLOYMENT CONFIG
echo ========================================
echo.

echo Choose your deployment configuration:
echo.
echo 1) LOCAL (http://localhost:5000)
echo 2) PRODUCTION (update API URL)
echo.

set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo Setting to LOCAL configuration...
    powershell -Command "
    $content = Get-Content 'js/api.js' -Raw
    $content = $content -replace 'new PortfolioAPI\(.*?\)', 'new PortfolioAPI(''http://localhost:5000/api'')'
    Set-Content 'js/api.js' $content
    "
    echo ✅ Updated to: http://localhost:5000
    goto end
)

if "%choice%"=="2" (
    echo.
    set /p backend_url="Enter your backend URL (e.g., https://designer-portfolio-backend.onrender.com): "
    echo.
    echo Updating API configuration...
    powershell -Command "
    $backendUrl = '%backend_url%/api'
    $content = Get-Content 'js/api.js' -Raw
    $content = $content -replace 'new PortfolioAPI\(.*?\)', ('new PortfolioAPI(''' + $backendUrl + ''')')
    Set-Content 'js/api.js' $content
    Write-Host '✅ Updated API URL to: ' -NoNewline
    Write-Host $backendUrl -ForegroundColor Green
    "
    goto end
)

echo Invalid choice. Please enter 1 or 2.

:end
echo.
echo ========================================
echo Configuration updated! Push to GitHub:
echo git add .
echo git commit -m "Update API URL for deployment"
echo git push
echo ========================================
echo.
