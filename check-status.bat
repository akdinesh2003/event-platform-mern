@echo off
echo ========================================
echo Mini Event Platform - Status Check
echo ========================================
echo.

echo Checking Backend...
curl -s http://localhost:5000/api/health
echo.
echo.

echo Checking Frontend...
curl -s http://localhost:3000
echo.
echo.

echo ========================================
echo If you see errors above:
echo 1. Backend not connected to MongoDB
echo 2. Follow QUICK_FIX.md to set up MongoDB Atlas
echo 3. Takes 2-3 minutes
echo ========================================
pause
