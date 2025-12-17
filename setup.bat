@echo off
echo ========================================
echo Mini Event Platform - Setup Script
echo ========================================
echo.

echo Installing root dependencies...
call npm install
echo.

echo Installing server dependencies...
cd server
call npm install
cd ..
echo.

echo Installing client dependencies...
cd client
call npm install
cd ..
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create server/.env file with your MongoDB URI and JWT secret
echo 2. Create client/.env file with your API URL
echo 3. Run 'npm run dev' to start both servers
echo.
echo See README.md for detailed instructions
echo ========================================
pause
