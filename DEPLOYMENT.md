# Deployment Guide

## Prerequisites
- GitHub account
- MongoDB Atlas account (free tier)
- Render/Railway account (for backend)
- Vercel/Netlify account (for frontend)

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user (Database Access)
4. Whitelist all IPs: Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Get your connection string: Connect → Connect your application
   - Format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/event-platform?retryWrites=true&w=majority`

## Step 2: Backend Deployment (Render)

### Using Render:

1. Push your code to GitHub
2. Go to [Render](https://render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: event-platform-api
   - **Root Directory**: server
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A random secure string (e.g., use a password generator)
   - `NODE_ENV`: production
   - `PORT`: 5000 (Render will override this automatically)
7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Copy your backend URL (e.g., `https://event-platform-api.onrender.com`)

### Alternative: Railway

1. Go to [Railway](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables (same as above)
5. Railway will auto-detect Node.js and deploy

## Step 3: Frontend Deployment (Vercel)

### Using Vercel:

1. Go to [Vercel](https://vercel.com/)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: client
   - **Build Command**: `npm run build`
   - **Output Directory**: build
5. Add Environment Variable:
   - `REACT_APP_API_URL`: Your backend URL + `/api` (e.g., `https://event-platform-api.onrender.com/api`)
6. Click "Deploy"
7. Wait for deployment (2-5 minutes)
8. Your app is live!

### Alternative: Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure:
   - **Base directory**: client
   - **Build command**: `npm run build`
   - **Publish directory**: client/build
5. Add environment variable: `REACT_APP_API_URL`
6. Click "Deploy site"

## Step 4: Update CORS (if needed)

If you encounter CORS errors, update `server/server.js`:

```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app'],
  credentials: true
}));
```

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Register a new account
3. Create an event with an image
4. RSVP to the event
5. Test all features

## Troubleshooting

### Backend Issues:
- Check Render/Railway logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Frontend Issues:
- Check browser console for errors
- Verify `REACT_APP_API_URL` is correct (must include `/api`)
- Clear browser cache and hard refresh

### Image Upload Issues:
- On free hosting, uploaded images may be lost on server restart
- Consider using cloud storage (AWS S3, Cloudinary) for production

## Free Tier Limitations

- **Render**: Server may sleep after 15 minutes of inactivity (first request takes ~30 seconds)
- **MongoDB Atlas**: 512MB storage limit
- **Vercel/Netlify**: Generous free tier for static sites

## Production Improvements

For a production app, consider:
1. Use cloud storage (AWS S3, Cloudinary) for images
2. Add rate limiting
3. Implement email verification
4. Add password reset functionality
5. Use Redis for session management
6. Add monitoring (Sentry, LogRocket)
7. Implement CI/CD pipelines
8. Add comprehensive error logging
