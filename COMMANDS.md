# Command Reference - Mini Event Platform

Quick reference for all commands you'll need.

## 🚀 Initial Setup

### Windows (Automated)
```cmd
setup.bat
```

### Manual Setup
```cmd
# Install all dependencies at once
npm run install-all

# Or install separately
cd server
npm install
cd ../client
npm install
```

## 🏃 Running the Application

### Run Both Servers (Recommended)
```cmd
# From root directory
npm run dev
```
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### Run Separately

**Backend Only:**
```cmd
cd server
npm run dev
```

**Frontend Only:**
```cmd
cd client
npm start
```

## 📦 Package Management

### Install Dependencies
```cmd
# Root
npm install

# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### Update Dependencies
```cmd
npm update
```

### Check for Outdated Packages
```cmd
npm outdated
```

## 🗄️ Database Commands

### MongoDB Local

**Start MongoDB:**
```cmd
# Windows Service
net start MongoDB

# Or manually
mongod --dbpath C:\data\db
```

**Stop MongoDB:**
```cmd
net stop MongoDB
```

**Check MongoDB Status:**
```cmd
mongod --version
```

**Connect to MongoDB Shell:**
```cmd
mongosh
```

### MongoDB Shell Commands
```javascript
// Show databases
show dbs

// Use database
use event-platform

// Show collections
show collections

// View users
db.users.find().pretty()

// View events
db.events.find().pretty()

// Count documents
db.events.countDocuments()

// Drop collection (careful!)
db.events.drop()

// Clear all events
db.events.deleteMany({})

// Find specific event
db.events.findOne({ title: "Tech Meetup" })

// Exit
exit
```

## 🔧 Development Commands

### Backend (server/)

**Development Mode (Auto-restart):**
```cmd
npm run dev
```

**Production Mode:**
```cmd
npm start
```

**Check for Errors:**
```cmd
node server.js
```

### Frontend (client/)

**Development Server:**
```cmd
npm start
```

**Production Build:**
```cmd
npm run build
```

**Test Build Locally:**
```cmd
npm run build
npx serve -s build
```

**Eject (Not Recommended):**
```cmd
npm run eject
```

## 🧪 Testing Commands

### Manual Testing

**Test Backend API:**
```cmd
# Health check
curl http://localhost:5000/api/health

# Get events
curl http://localhost:5000/api/events

# Register user (PowerShell)
Invoke-RestMethod -Uri http://localhost:5000/api/auth/register -Method POST -Body (@{name="Test";email="test@test.com";password="123456"} | ConvertTo-Json) -ContentType "application/json"
```

### Concurrency Testing

**Create test script (test-rsvp.js):**
```javascript
const axios = require('axios');

async function testConcurrency() {
  const eventId = 'YOUR_EVENT_ID';
  const tokens = ['token1', 'token2', 'token3'];
  
  const promises = tokens.map(token =>
    axios.post(`http://localhost:5000/api/events/${eventId}/rsvp`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(err => ({ error: err.response?.data }))
  );
  
  const results = await Promise.all(promises);
  console.log(results);
}

testConcurrency();
```

**Run test:**
```cmd
node test-rsvp.js
```

## 🐛 Debugging Commands

### Check Ports
```cmd
# Check if port is in use
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID> /F
```

### View Logs
```cmd
# Backend logs (if running)
# Check terminal where server is running

# Frontend logs
# Check browser console (F12)
```

### Clear Cache
```cmd
# npm cache
npm cache clean --force

# Delete node_modules
rmdir /s /q node_modules
del package-lock.json
npm install
```

## 🔍 Inspection Commands

### Check Versions
```cmd
node --version
npm --version
mongod --version
git --version
```

### View Environment Variables
```cmd
# Windows
type server\.env
type client\.env

# Or
echo %PATH%
```

### Check Running Processes
```cmd
# All Node processes
tasklist | findstr node

# All processes on port
netstat -ano | findstr :5000
```

## 📝 Git Commands

### Initial Setup
```cmd
git init
git add .
git commit -m "Initial commit: Complete MERN event platform"
```

### Create Repository
```cmd
# Create on GitHub first, then:
git remote add origin https://github.com/yourusername/mini-event-platform.git
git branch -M main
git push -u origin main
```

### Regular Workflow
```cmd
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Your message"

# Push
git push

# Pull
git pull
```

### Useful Git Commands
```cmd
# View commit history
git log --oneline

# Create branch
git checkout -b feature-name

# Switch branch
git checkout main

# View changes
git diff

# Undo changes
git checkout -- filename
```

## 🚀 Deployment Commands

### Backend (Render)

**Via Render Dashboard:**
1. Connect GitHub repo
2. Set environment variables
3. Deploy automatically

**Manual Deploy (if using Render CLI):**
```cmd
render deploy
```

### Frontend (Vercel)

**Via Vercel CLI:**
```cmd
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd client
vercel

# Production deploy
vercel --prod
```

**Via Vercel Dashboard:**
1. Import GitHub repo
2. Configure build settings
3. Deploy

### Frontend (Netlify)

**Via Netlify CLI:**
```cmd
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd client
netlify deploy

# Production deploy
netlify deploy --prod
```

## 🧹 Cleanup Commands

### Remove Dependencies
```cmd
# Remove node_modules
rmdir /s /q node_modules

# Remove package-lock
del package-lock.json

# Remove build
cd client
rmdir /s /q build
```

### Reset Project
```cmd
# Clean everything
rmdir /s /q node_modules
rmdir /s /q server\node_modules
rmdir /s /q client\node_modules
del package-lock.json
del server\package-lock.json
del client\package-lock.json

# Reinstall
npm run install-all
```

### Clear Uploads
```cmd
cd server\uploads
del /q *.*
```

## 📊 Monitoring Commands

### Check Server Status
```cmd
# Test backend
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:3000
```

### Monitor Logs
```cmd
# Backend (in server terminal)
# Logs appear automatically with nodemon

# Frontend (in client terminal)
# Logs appear automatically
```

## 🔐 Security Commands

### Generate JWT Secret
```cmd
# PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or use online generator
# https://randomkeygen.com/
```

### Check for Vulnerabilities
```cmd
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix
npm audit fix --force
```

## 📦 Build Commands

### Production Build

**Backend:**
```cmd
cd server
npm install --production
```

**Frontend:**
```cmd
cd client
npm run build
```

### Optimize Build
```cmd
# Analyze bundle size
cd client
npm install --save-dev webpack-bundle-analyzer
npm run build
```

## 🔄 Update Commands

### Update Project
```cmd
# Pull latest changes
git pull

# Install new dependencies
npm run install-all

# Restart servers
npm run dev
```

### Update Dependencies
```cmd
# Check outdated
npm outdated

# Update all
npm update

# Update specific package
npm update package-name
```

## 🆘 Emergency Commands

### Server Won't Start
```cmd
# Kill all Node processes
taskkill /F /IM node.exe

# Clear port
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Restart
npm run dev
```

### Database Issues
```cmd
# Restart MongoDB
net stop MongoDB
net start MongoDB

# Or reset database (development only)
mongosh
use event-platform
db.dropDatabase()
```

### Frontend Issues
```cmd
# Clear cache and rebuild
cd client
rmdir /s /q node_modules
rmdir /s /q build
del package-lock.json
npm install
npm start
```

## 📚 Useful Shortcuts

### Terminal Shortcuts
- `Ctrl + C` - Stop running process
- `Ctrl + L` - Clear terminal
- `↑` / `↓` - Navigate command history
- `Tab` - Auto-complete

### Browser Shortcuts
- `F12` - Open DevTools
- `Ctrl + Shift + R` - Hard refresh
- `Ctrl + Shift + Delete` - Clear cache
- `Ctrl + Shift + I` - Inspect element

## 🎯 Common Workflows

### Start Development
```cmd
# 1. Start MongoDB (if local)
net start MongoDB

# 2. Start both servers
npm run dev

# 3. Open browser
start http://localhost:3000
```

### Deploy Updates
```cmd
# 1. Commit changes
git add .
git commit -m "Update: description"
git push

# 2. Deployment happens automatically
# (if connected to Render/Vercel)
```

### Fix Issues
```cmd
# 1. Check logs
# Look at terminal output

# 2. Clear cache
npm cache clean --force

# 3. Reinstall
rmdir /s /q node_modules
npm install

# 4. Restart
npm run dev
```

## 📖 Reference

### Package Scripts (Root)
```json
{
  "install-all": "Install all dependencies",
  "dev": "Run both servers",
  "server": "Run backend only",
  "client": "Run frontend only"
}
```

### Package Scripts (Server)
```json
{
  "start": "Production mode",
  "dev": "Development mode with nodemon"
}
```

### Package Scripts (Client)
```json
{
  "start": "Development server",
  "build": "Production build",
  "test": "Run tests",
  "eject": "Eject from CRA"
}
```

---

## 💡 Pro Tips

1. **Always run from correct directory**
   - Root: `npm run dev`
   - Server: `cd server && npm run dev`
   - Client: `cd client && npm start`

2. **Check logs first**
   - Backend: Terminal output
   - Frontend: Browser console (F12)

3. **Use nodemon for development**
   - Auto-restarts on file changes
   - Saves time

4. **Keep terminals organized**
   - One for backend
   - One for frontend
   - One for commands

5. **Commit often**
   - Small, focused commits
   - Clear commit messages
   - Push regularly

---

**Quick Reference Card**

```
Setup:     setup.bat
Run:       npm run dev
Backend:   cd server && npm run dev
Frontend:  cd client && npm start
Build:     cd client && npm run build
Test:      curl http://localhost:5000/api/health
Deploy:    git push (auto-deploy)
Help:      See TROUBLESHOOTING.md
```

---

Keep this file handy for quick command reference! 🚀
