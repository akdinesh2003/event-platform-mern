@echo off
echo ========================================
echo Pushing to GitHub: akdinesh2003/event-platform-mern
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

echo Step 4: Adding remote repository...
git remote add origin https://github.com/akdinesh2003/event-platform-mern.git
echo.

echo Step 5: Setting branch to main...
git branch -M main
echo.

echo Step 6: Pushing to GitHub...
git push -u origin main
echo.

echo ========================================
echo Done! Your code is now on GitHub!
echo ========================================
echo.
echo Repository URL:
echo https://github.com/akdinesh2003/event-platform-mern
echo.
pause
