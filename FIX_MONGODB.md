# 🔧 Fix: Registration Failed - MongoDB Not Connected

## The Problem

You're seeing "Registration failed" because the backend can't connect to MongoDB. The database needs to be set up.

## ✅ Quick Fix (Choose One Option)

### Option 1: MongoDB Atlas (Recommended - 5 Minutes, Free)

**Step-by-step:**

1. **Open**: https://www.mongodb.com/cloud/atlas/register

2. **Sign Up** (free, no credit card needed)

3. **Create a Cluster**:
   - Click "Build a Database"
   - Choose "M0 FREE"
   - Select a region close to you
   - Click "Create"

4. **Create Database User**:
   - Username: `eventuser`
   - Password: Create a strong password (SAVE THIS!)
   - Click "Create User"

5. **Set Network Access**:
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

6. **Get Connection String**:
   - Click "Database" in left menu
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://eventuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

7. **Update Your .env File**:
   - Open `server/.env`
   - Replace the MONGODB_URI line with your connection string
   - Replace `<password>` with your actual password
   - Add `/event-platform` before the `?`
   
   **Example:**
   ```env
   MONGODB_URI=mongodb+srv://eventuser:MyPass123@cluster0.abc123.mongodb.net/event-platform?retryWrites=true&w=majority
   ```

8. **Restart Backend**:
   - Go to the backend PowerShell window
   - Press `Ctrl + C` to stop
   - Type: `npm run dev`
   - Press Enter

9. **Test Registration**:
   - Go back to http://localhost:3000
   - Try registering again
   - Should work now! ✅

---

### Option 2: Install MongoDB Locally (15 Minutes)

**If you prefer local installation:**

1. **Download MongoDB**:
   - Go to: https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server
   - Install with default settings

2. **Start MongoDB**:
   ```cmd
   net start MongoDB
   ```

3. **Verify It's Running**:
   ```cmd
   mongosh
   ```
   (Should connect without errors)

4. **Update .env** (already set for local):
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/event-platform
   ```

5. **Restart Backend**:
   - Go to backend PowerShell window
   - Press `Ctrl + C`
   - Type: `npm run dev`

6. **Test Registration** - Should work! ✅

---

## 🎯 Recommended: Use MongoDB Atlas

**Why?**
- ✅ Free forever (M0 tier)
- ✅ No installation needed
- ✅ Works from anywhere
- ✅ Automatic backups
- ✅ Easy to deploy later

**Time:** 5 minutes

---

## 📋 Quick Checklist

After setting up MongoDB:

- [ ] MongoDB Atlas cluster created (or local MongoDB running)
- [ ] Database user created
- [ ] IP whitelisted (0.0.0.0/0)
- [ ] Connection string copied
- [ ] `server/.env` updated with connection string
- [ ] Backend restarted
- [ ] Registration works ✅

---

## 🔍 Verify It's Working

### 1. Check Backend Console
After restarting, you should see:
```
MongoDB connected successfully
Server running on port 5000
```

### 2. Test Health Endpoint
Open: http://localhost:5000/api/health

Should return:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 3. Try Registration Again
- Go to: http://localhost:3000/register
- Fill in the form
- Click Register
- Should redirect to home page ✅

---

## 🆘 Still Having Issues?

### Backend shows "MongooseServerSelectionError"
- Check connection string is correct
- Verify password doesn't have special characters (or URL encode them)
- Ensure IP is whitelisted (0.0.0.0/0)
- Wait 2-3 minutes after creating cluster

### "Authentication failed"
- Double-check username and password
- Ensure password in connection string matches database user password
- No spaces in connection string

### "Network timeout"
- Check your internet connection
- Verify IP whitelist includes 0.0.0.0/0
- Try a different network

### Backend won't restart
- Kill all Node processes: `taskkill /F /IM node.exe`
- Navigate to server folder: `cd server`
- Start again: `npm run dev`

---

## 💡 Pro Tips

1. **Save your password** - You'll need it for the connection string
2. **Use 0.0.0.0/0** for IP whitelist during development
3. **Wait 2-3 minutes** after creating cluster before connecting
4. **Check for typos** in connection string
5. **Restart backend** after changing .env

---

## 📞 Need More Help?

- **MongoDB Atlas Guide**: https://www.mongodb.com/docs/atlas/getting-started/
- **Connection String Format**: https://www.mongodb.com/docs/manual/reference/connection-string/
- **Troubleshooting**: See `TROUBLESHOOTING.md`

---

## ✨ Once Fixed

After MongoDB is connected, you can:
- ✅ Register users
- ✅ Create events
- ✅ Upload images
- ✅ RSVP to events
- ✅ Use all features

**Time to fix**: 5 minutes with MongoDB Atlas

**Let's get this working! 🚀**
