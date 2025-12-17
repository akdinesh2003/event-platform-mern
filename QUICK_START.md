# Quick Start Guide

Get the Mini Event Platform running in 5 minutes!

## Prerequisites Check

```bash
node --version    # Should be v14 or higher
npm --version     # Should be v6 or higher
```

If you don't have Node.js, download it from [nodejs.org](https://nodejs.org/)

## Installation (Windows)

### Option 1: Automated Setup (Recommended)

```cmd
setup.bat
```

### Option 2: Manual Setup

```cmd
# Install all dependencies
npm run install-all
```

## Configuration

### 1. Backend Configuration

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-platform
JWT_SECRET=my_super_secret_jwt_key_12345
NODE_ENV=development
```

**Don't have MongoDB installed locally?**
Use MongoDB Atlas (free):
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Replace `MONGODB_URI` with your Atlas connection string

### 2. Frontend Configuration

Create `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Option 1: Run Both Servers Together

```cmd
npm run dev
```

This starts:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`

### Option 2: Run Separately

**Terminal 1 - Backend:**
```cmd
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```cmd
cd client
npm start
```

## First Steps

1. Open `http://localhost:3000` in your browser
2. Click "Register" and create an account
3. Create your first event
4. Upload an image (optional)
5. RSVP to the event
6. Check your dashboard

## Testing the App

### Test User Registration
```
Name: John Doe
Email: john@example.com
Password: password123
```

### Test Event Creation
```
Title: Tech Meetup 2024
Description: Join us for an evening of networking and tech talks
Date: Select any future date
Location: 123 Main St, City
Capacity: 50
Image: Upload any image
```

### Test RSVP System
1. Create an event with capacity of 2
2. Open in incognito window
3. Register another user
4. Both users RSVP
5. Try third user - should fail (event full)

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Check if MongoDB is running: `mongod --version`
- Or use MongoDB Atlas connection string
- Verify `MONGODB_URI` in `.env`

### Issue: "Port 5000 already in use"
**Solution**: 
- Change `PORT` in `server/.env` to 5001
- Update `REACT_APP_API_URL` in `client/.env` accordingly

### Issue: "Module not found"
**Solution**: 
```cmd
# Reinstall dependencies
cd server
npm install
cd ../client
npm install
```

### Issue: Images not displaying
**Solution**: 
- Check `uploads` folder exists in `server/`
- Verify `REACT_APP_API_URL` doesn't end with `/api`
- Clear browser cache

### Issue: "Token is not valid"
**Solution**: 
- Logout and login again
- Clear localStorage in browser DevTools
- Check `JWT_SECRET` is set in `server/.env`

## Development Tips

### View Database
- Install MongoDB Compass
- Connect to your MongoDB URI
- Browse `event-platform` database

### API Testing
Use Postman or Thunder Client:

**Register:**
```
POST http://localhost:5000/api/auth/register
Body: { "name": "Test", "email": "test@test.com", "password": "123456" }
```

**Get Events:**
```
GET http://localhost:5000/api/events
```

### Browser DevTools
- **Console**: Check for JavaScript errors
- **Network**: Monitor API requests
- **Application**: View localStorage (token)

## Project Commands Reference

```cmd
# Root directory
npm run install-all    # Install all dependencies
npm run dev           # Run both servers
npm run server        # Run backend only
npm run client        # Run frontend only

# Server directory
cd server
npm install           # Install backend deps
npm run dev          # Run with nodemon (auto-restart)
npm start            # Run production mode

# Client directory
cd client
npm install          # Install frontend deps
npm start            # Run development server
npm run build        # Build for production
```

## File Structure Quick Reference

```
Key Files to Know:
├── server/
│   ├── server.js                    # Backend entry point
│   ├── controllers/eventController.js  # RSVP logic here!
│   └── .env                         # Backend config
├── client/
│   ├── src/App.js                   # Frontend entry point
│   ├── src/pages/Home.js            # Events listing
│   └── .env                         # Frontend config
└── README.md                        # Full documentation
```

## Next Steps

1. ✅ Get the app running locally
2. ✅ Test all features
3. ✅ Read `README.md` for detailed info
4. ✅ Read `TESTING.md` to understand concurrency handling
5. ✅ Read `DEPLOYMENT.md` when ready to deploy
6. ✅ Customize and add your own features!

## Need Help?

- Check `README.md` for detailed documentation
- Review `PROJECT_STRUCTURE.md` for architecture
- Read `TESTING.md` for concurrency explanation
- See `DEPLOYMENT.md` for deployment steps

## Ready to Deploy?

Once everything works locally:
1. Push code to GitHub
2. Follow `DEPLOYMENT.md` guide
3. Deploy backend to Render
4. Deploy frontend to Vercel
5. Share your live URL!

---

**Happy Coding! 🚀**
