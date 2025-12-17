# 🎯 MongoDB Atlas Setup - Step by Step

## Current Issue: Registration Failed ❌

**Why?** Backend can't connect to database.

**Solution:** Set up MongoDB Atlas (5 minutes)

---

## 📝 Step-by-Step Instructions

### Step 1: Create MongoDB Atlas Account

1. Open: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with:
   - Email
   - Google account
   - Or GitHub account
3. Click "Sign Up"

**Time:** 1 minute

---

### Step 2: Create Your First Cluster

1. You'll see "Deploy a cloud database"
2. Click **"Build a Database"**
3. Choose **"M0 FREE"** (left option)
4. Select:
   - Provider: AWS (or any)
   - Region: Choose closest to you
   - Cluster Name: Leave default or name it "EventPlatform"
5. Click **"Create"**
6. Wait 2-3 minutes for cluster to deploy

**Time:** 3 minutes (including wait time)

---

### Step 3: Create Database User

1. You'll see "Security Quickstart"
2. Under "How would you like to authenticate?"
3. Choose **"Username and Password"**
4. Enter:
   - Username: `eventuser`
   - Password: Click "Autogenerate Secure Password" OR create your own
5. **IMPORTANT:** Click the copy icon to save your password!
6. Click **"Create User"**

**Time:** 30 seconds

---

### Step 4: Set Network Access

1. Still on Security Quickstart
2. Under "Where would you like to connect from?"
3. Click **"My Local Environment"**
4. Click **"Add My Current IP Address"**
5. **IMPORTANT:** Also click "Add IP Address" button
6. Enter: `0.0.0.0/0` (allows from anywhere)
7. Click **"Add Entry"**
8. Click **"Finish and Close"**

**Time:** 30 seconds

---

### Step 5: Get Connection String

1. Click **"Go to Databases"** (or click "Database" in left menu)
2. You'll see your cluster
3. Click **"Connect"** button
4. Click **"Drivers"**
5. Select:
   - Driver: Node.js
   - Version: 4.1 or later
6. Copy the connection string (looks like):
   ```
   mongodb+srv://eventuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Save this string!**

**Time:** 30 seconds

---

### Step 6: Update Your .env File

1. Open your project folder
2. Navigate to: `server/.env`
3. Find the line starting with `MONGODB_URI=`
4. Replace it with your connection string
5. **IMPORTANT Changes:**
   - Replace `<password>` with your actual password
   - Add `/event-platform` before the `?`

**Before:**
```env
MONGODB_URI=mongodb://127.0.0.1:27017/event-platform
```

**After:**
```env
MONGODB_URI=mongodb+srv://eventuser:YourActualPassword@cluster0.abc123.mongodb.net/event-platform?retryWrites=true&w=majority
```

6. Save the file (Ctrl + S)

**Time:** 1 minute

---

### Step 7: Restart Backend Server

1. Find the PowerShell window running the backend
2. Press **Ctrl + C** to stop the server
3. Type: `npm run dev`
4. Press **Enter**
5. Wait for "MongoDB connected successfully" message

**Expected Output:**
```
MongoDB connected successfully
Server running on port 5000
```

**Time:** 30 seconds

---

### Step 8: Test Registration

1. Go to: http://localhost:3000
2. Click **"Register"**
3. Fill in:
   - Name: Your name
   - Email: Your email
   - Password: At least 6 characters
4. Click **"Register"**
5. Should redirect to home page ✅

**Success!** You're now registered and logged in!

**Time:** 30 seconds

---

## ✅ Total Time: ~5-7 Minutes

---

## 🎉 What You Can Do Now

After successful setup:

1. **Create Events**
   - Click "Create Event"
   - Fill in details
   - Upload an image
   - Submit

2. **RSVP to Events**
   - Click on any event
   - Click "RSVP to Event"
   - See yourself in attendees list

3. **View Dashboard**
   - Click "Dashboard"
   - See events you created
   - See events you're attending

4. **Search Events**
   - Use search bar on home page
   - Filter by upcoming events

---

## 🔍 Verification Checklist

After setup, verify:

- [ ] Backend shows "MongoDB connected successfully"
- [ ] http://localhost:5000/api/health returns OK
- [ ] Can register new user
- [ ] Can login
- [ ] Can create event
- [ ] Can RSVP to event
- [ ] Can view dashboard

---

## 🆘 Common Issues

### Issue: "Authentication failed"
**Fix:** 
- Check password in connection string
- Ensure no spaces in connection string
- Verify database user was created

### Issue: "Network timeout"
**Fix:**
- Verify IP 0.0.0.0/0 is whitelisted
- Wait 2-3 minutes after creating cluster
- Check internet connection

### Issue: Backend still shows error
**Fix:**
- Verify .env file was saved
- Restart backend (Ctrl+C, then npm run dev)
- Check for typos in connection string

### Issue: Can't find PowerShell window
**Fix:**
- Check taskbar for PowerShell icons
- Or manually restart:
  ```cmd
  cd server
  npm run dev
  ```

---

## 💡 Quick Tips

1. **Password Issues?**
   - Use simple password without special characters
   - Or URL encode special characters

2. **Connection String Format:**
   ```
   mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?options
   ```

3. **Database Name:**
   - Must be `/event-platform` before the `?`
   - Example: `...mongodb.net/event-platform?retryWrites...`

4. **Save Everything:**
   - Save your password
   - Save connection string
   - Save .env file

---

## 📞 Still Stuck?

1. **Check backend console** for specific error
2. **See FIX_MONGODB.md** for detailed troubleshooting
3. **See TROUBLESHOOTING.md** for general issues

---

## 🎯 Your Connection String Template

Fill this in and use it:

```env
MONGODB_URI=mongodb+srv://eventuser:YOUR_PASSWORD_HERE@cluster0.XXXXX.mongodb.net/event-platform?retryWrites=true&w=majority
```

Replace:
- `YOUR_PASSWORD_HERE` → Your actual password
- `XXXXX` → Your cluster ID (from Atlas)

---

**You're almost there! Just follow these steps and you'll be up and running! 🚀**
