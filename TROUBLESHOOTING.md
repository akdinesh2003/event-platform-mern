# Troubleshooting Guide

Common issues and their solutions when running the Mini Event Platform.

## Installation Issues

### Issue: `npm install` fails
**Symptoms**: Errors during dependency installation

**Solutions**:
```cmd
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

### Issue: Python/node-gyp errors
**Symptoms**: Build errors mentioning Python or node-gyp

**Solution**:
```cmd
# Install Windows build tools
npm install --global windows-build-tools

# Or use specific Node version
nvm install 16
nvm use 16
```

## MongoDB Issues

### Issue: Cannot connect to MongoDB
**Symptoms**: `MongooseServerSelectionError` or connection timeout

**Solutions**:

1. **Using Local MongoDB**:
```cmd
# Check if MongoDB is running
mongod --version

# Start MongoDB service (Windows)
net start MongoDB

# Or run manually
mongod --dbpath C:\data\db
```

2. **Using MongoDB Atlas**:
- Verify connection string format
- Check IP whitelist (add 0.0.0.0/0 for testing)
- Verify username/password
- Ensure database user has read/write permissions

**Correct connection string format**:
```
mongodb+srv://username:password@cluster.mongodb.net/event-platform?retryWrites=true&w=majority
```

### Issue: Authentication failed
**Symptoms**: `MongoServerError: Authentication failed`

**Solution**:
- Double-check username and password in connection string
- Ensure special characters in password are URL-encoded
- Recreate database user in MongoDB Atlas

## Backend Issues

### Issue: Port already in use
**Symptoms**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions**:

1. **Change port**:
```env
# In server/.env
PORT=5001
```

2. **Kill process using port**:
```cmd
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Issue: JWT token errors
**Symptoms**: `Token is not valid` or `No authentication token`

**Solutions**:
- Verify `JWT_SECRET` is set in `server/.env`
- Clear localStorage in browser
- Logout and login again
- Check token format in Authorization header

### Issue: File upload fails
**Symptoms**: Images not uploading or 500 error

**Solutions**:
- Verify `uploads` folder exists in `server/`
- Check file size (max 5MB)
- Verify file type (only images allowed)
- Check folder permissions

```cmd
# Create uploads folder if missing
cd server
mkdir uploads
```

### Issue: CORS errors
**Symptoms**: `Access-Control-Allow-Origin` errors in browser console

**Solution**:
```javascript
// In server/server.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-url.com'],
  credentials: true
}));
```

## Frontend Issues

### Issue: Blank page or white screen
**Symptoms**: Nothing displays, console shows errors

**Solutions**:
1. Check browser console for errors
2. Verify `REACT_APP_API_URL` in `client/.env`
3. Clear browser cache (Ctrl + Shift + Delete)
4. Hard refresh (Ctrl + F5)

```cmd
# Rebuild
cd client
npm run build
```

### Issue: API calls failing
**Symptoms**: Network errors, 404 on API calls

**Solutions**:
- Verify backend is running on correct port
- Check `REACT_APP_API_URL` format (should include `/api`)
- Verify CORS is configured on backend
- Check browser Network tab for actual error

**Correct format**:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Issue: Images not displaying
**Symptoms**: Broken image icons, 404 on image URLs

**Solutions**:
- Verify backend is serving static files
- Check image URL construction in EventCard.js
- Ensure `REACT_APP_API_URL` doesn't end with `/api` when constructing image URLs

```javascript
// Correct image URL construction
const API_URL = process.env.REACT_APP_API_URL || '';
const imageUrl = event.image ? `${API_URL.replace('/api', '')}${event.image}` : null;
```

### Issue: React Router not working
**Symptoms**: 404 on page refresh, routes not working

**Solution** (for deployment):
```json
// Add to client/public/_redirects (Netlify)
/*    /index.html   200

// Or vercel.json (Vercel)
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Development Issues

### Issue: Changes not reflecting
**Symptoms**: Code changes don't appear in browser

**Solutions**:
1. Check if dev server is running
2. Hard refresh browser (Ctrl + F5)
3. Clear browser cache
4. Restart dev server

```cmd
# Stop server (Ctrl + C)
# Restart
npm start
```

### Issue: Hot reload not working
**Symptoms**: Must manually refresh to see changes

**Solution**:
```cmd
# Set environment variable (Windows)
set FAST_REFRESH=true

# Or add to client/.env
FAST_REFRESH=true
```

## Deployment Issues

### Issue: Build fails on Vercel/Netlify
**Symptoms**: Deployment fails during build step

**Solutions**:
- Check build logs for specific error
- Verify all dependencies are in `package.json`
- Ensure no dev dependencies are required in production
- Check Node version compatibility

```json
// Add to package.json
"engines": {
  "node": "16.x",
  "npm": "8.x"
}
```

### Issue: Environment variables not working
**Symptoms**: App works locally but not in production

**Solutions**:
- Verify all env vars are set in deployment platform
- Check variable names (must start with `REACT_APP_` for React)
- Redeploy after adding variables
- Check for typos in variable names

### Issue: Backend sleeps on Render free tier
**Symptoms**: First request takes 30+ seconds

**Solution**:
- This is expected on free tier
- Consider upgrading to paid tier
- Or use Railway (faster cold starts)
- Implement a keep-alive ping service

### Issue: Images lost after deployment
**Symptoms**: Uploaded images disappear after server restart

**Solution**:
- Free hosting has ephemeral file systems
- Use cloud storage for production:
  - AWS S3
  - Cloudinary
  - Firebase Storage

## Database Issues

### Issue: Duplicate key error
**Symptoms**: `E11000 duplicate key error`

**Solutions**:
- User with email already exists
- Check unique indexes in models
- Drop and recreate collection if in development

```javascript
// In MongoDB Compass or shell
db.users.drop()
db.events.drop()
```

### Issue: Validation errors
**Symptoms**: `ValidationError: Path is required`

**Solutions**:
- Check all required fields are provided
- Verify data types match schema
- Check for null/undefined values

## Performance Issues

### Issue: Slow API responses
**Symptoms**: Long loading times

**Solutions**:
- Add database indexes
- Implement pagination
- Optimize populate queries
- Use select to limit fields

```javascript
// Add indexes
eventSchema.index({ date: 1 });
eventSchema.index({ creator: 1 });

// Optimize queries
Event.find()
  .select('title date location capacity')
  .limit(20)
  .lean();
```

### Issue: Memory leaks
**Symptoms**: Server crashes after running for a while

**Solutions**:
- Check for unclosed database connections
- Implement proper error handling
- Use connection pooling
- Monitor memory usage

## Testing Issues

### Issue: Cannot test concurrency
**Symptoms**: Need to verify race condition handling

**Solution**:
```javascript
// Create test script: test-concurrent-rsvp.js
const axios = require('axios');

async function testConcurrency() {
  const eventId = 'your-event-id';
  const tokens = ['token1', 'token2', 'token3', 'token4', 'token5'];
  
  const promises = tokens.map(token =>
    axios.post(`http://localhost:5000/api/events/${eventId}/rsvp`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(err => err.response)
  );
  
  const results = await Promise.all(promises);
  console.log('Results:', results.map(r => r.status));
}

testConcurrency();
```

## Security Issues

### Issue: JWT token exposed
**Symptoms**: Security concerns about token storage

**Solution**:
- Current implementation uses localStorage (acceptable for this project)
- For production, consider:
  - HttpOnly cookies
  - Refresh token rotation
  - Token expiration handling

### Issue: File upload vulnerabilities
**Symptoms**: Concerns about malicious file uploads

**Current protections**:
- File type validation (images only)
- File size limit (5MB)
- Unique filenames

**Additional protections** (for production):
- Virus scanning
- Image processing/sanitization
- Separate storage domain

## Getting Help

If you're still stuck:

1. **Check the logs**:
   - Backend: Terminal running server
   - Frontend: Browser console (F12)
   - Database: MongoDB logs

2. **Review documentation**:
   - README.md
   - QUICK_START.md
   - PROJECT_STRUCTURE.md

3. **Common debugging steps**:
   ```cmd
   # Clean install
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   
   # Reset database (development only)
   # Drop collections in MongoDB Compass
   
   # Clear browser data
   # Chrome: Ctrl + Shift + Delete
   
   # Restart everything
   # Stop all servers
   # Start backend first
   # Then start frontend
   ```

4. **Check versions**:
   ```cmd
   node --version
   npm --version
   mongod --version
   ```

5. **Verify environment**:
   ```cmd
   # Backend
   cd server
   type .env
   
   # Frontend
   cd client
   type .env
   ```

## Still Having Issues?

Create a detailed issue report including:
- Operating system and version
- Node.js and npm versions
- Exact error message
- Steps to reproduce
- What you've already tried
- Screenshots if applicable

Remember: Most issues are related to:
1. Missing environment variables
2. Incorrect MongoDB connection
3. Port conflicts
4. Missing dependencies
5. CORS configuration

Double-check these first! 🔍
