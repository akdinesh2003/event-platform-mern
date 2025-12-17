@echo off
echo ========================================
echo GitHub Upload Helper
echo ========================================
echo.

echo Step 1: Initializing Git...
git init
echo.

echo Step 2: Adding all files...
git add .
echo.

echo Step 3: Creating commit...
git commit -m "Initial commit: Complete MERN Event Platform with authentication, CRUD, RSVP system, and modern UI"
echo.

echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Go to: https://github.com/new
echo 2. Repository name: event-platform-mern
echo 3. Make it Public
echo 4. DO NOT initialize with README
echo 5. Click "Create repository"
echo.
echo 6. Then run these commands (replace YOUR_USERNAME):
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/event-platform-mern.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo ========================================
pause
