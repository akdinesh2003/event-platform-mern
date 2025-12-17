# Features Guide - Mini Event Platform

A detailed walkthrough of all features and how to use them.

## 🏠 Home Page (Events Listing)

**URL**: `/`  
**Access**: Public (no login required)

### Features:
- **Event Grid**: Displays all events in a responsive card layout
- **Search Bar**: Search events by title, description, or location
- **Filter Toggle**: Show only upcoming events
- **Event Cards Show**:
  - Event image (if uploaded)
  - Title and description preview
  - Date and time
  - Location
  - Capacity status (spots left or FULL)
  - Attendee count

### User Actions:
- Click any event card to view details
- Use search to find specific events
- Toggle upcoming filter

---

## 🔐 Authentication

### Register Page
**URL**: `/register`  
**Access**: Public

**Fields**:
- Name (required)
- Email (required, must be valid email)
- Password (required, minimum 6 characters)

**Features**:
- Form validation
- Error messages for invalid input
- Automatic login after registration
- Redirect to home page

### Login Page
**URL**: `/login`  
**Access**: Public

**Fields**:
- Email (required)
- Password (required)

**Features**:
- Form validation
- Error messages for invalid credentials
- Remember user (token stored in localStorage)
- Redirect to home page

---

## ➕ Create Event

**URL**: `/create-event`  
**Access**: Authenticated users only

### Form Fields:
1. **Title** (required)
   - Event name
   - Text input

2. **Description** (required)
   - Detailed event information
   - Textarea (4 rows)

3. **Date & Time** (required)
   - When the event happens
   - DateTime picker

4. **Location** (required)
   - Where the event takes place
   - Text input

5. **Capacity** (required)
   - Maximum number of attendees
   - Number input (minimum 1)

6. **Image** (optional)
   - Event photo
   - File upload (images only, max 5MB)
   - Supported formats: JPG, PNG, GIF, WebP

### Features:
- Real-time validation
- Image preview (browser default)
- Loading state during upload
- Error handling
- Success redirect to home page

### Example Event:
```
Title: Tech Meetup 2024
Description: Join us for an evening of networking, tech talks, and pizza! 
             We'll have speakers from leading tech companies sharing insights 
             on the latest trends in web development.
Date: 2024-12-25 18:00
Location: Tech Hub, 123 Innovation Street, San Francisco
Capacity: 50
Image: [Upload event-photo.jpg]
```

---

## 📋 Event Detail Page

**URL**: `/events/:id`  
**Access**: Public (RSVP requires login)

### Information Displayed:
- Full-size event image
- Complete title and description
- Formatted date and time
- Location with icon
- Creator name
- Current attendee count vs capacity
- "EVENT FULL" badge if at capacity
- List of all attendees (names)

### User Actions:

#### For Non-Creators:
1. **RSVP to Event**
   - Button: "RSVP to Event"
   - Disabled if event is full
   - Requires login
   - Adds user to attendees list
   - Updates count in real-time

2. **Cancel RSVP**
   - Button: "Cancel RSVP" (if already RSVP'd)
   - Removes user from attendees
   - Frees up a spot

#### For Event Creators:
1. **Edit Event**
   - Button: "Edit Event"
   - Navigates to edit form
   - Pre-filled with current data

2. **Delete Event**
   - Button: "Delete Event"
   - Shows confirmation dialog
   - Permanently removes event
   - Redirects to home page

### Features:
- Responsive layout
- Real-time capacity updates
- Loading states for actions
- Error messages
- Success feedback

---

## ✏️ Edit Event

**URL**: `/edit-event/:id`  
**Access**: Event creator only

### Features:
- Pre-filled form with current event data
- Same fields as create event
- Can update image (optional)
- Validation on all fields
- Loading state during update
- Redirect to event detail on success

### Restrictions:
- Only the event creator can access
- 403 error if non-creator tries to access
- Cannot change creator

---

## 📊 User Dashboard

**URL**: `/dashboard`  
**Access**: Authenticated users only

### Sections:

#### 1. Events I Created
- Shows all events created by the user
- Displays attendee count for each
- Click to view/edit event
- Empty state if no events created

#### 2. Events I'm Attending
- Shows all events user has RSVP'd to
- Displays event details
- Click to view event
- Can cancel RSVP from event detail page
- Empty state if no RSVPs

### Features:
- Organized by sections
- Event count badges
- Same card layout as home page
- Responsive grid
- Loading state

---

## 🔍 Search & Filter

### Search Functionality
**Location**: Home page search bar

**Searches**:
- Event titles
- Event descriptions
- Event locations

**Features**:
- Case-insensitive
- Partial matching
- Real-time results
- Clear search button

**Example Searches**:
- "tech" - finds all tech-related events
- "san francisco" - finds events in SF
- "meetup" - finds all meetups

### Filter Functionality
**Location**: Home page checkbox

**Options**:
- ☑️ Show only upcoming events (default)
- ☐ Show all events (including past)

**Features**:
- Instant filtering
- Persists during search
- Clear visual indicator

---

## 🎯 RSVP System (Core Feature)

### How It Works:

1. **User Clicks RSVP**
   - Frontend sends POST request
   - Includes JWT token for authentication

2. **Backend Processing**
   - Validates user token
   - Executes atomic MongoDB operation:
     ```javascript
     Event.findOneAndUpdate(
       {
         _id: eventId,
         $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] },
         attendees: { $ne: userId }
       },
       { $addToSet: { attendees: userId } }
     )
     ```

3. **Response**
   - Success: Updated event with new attendee
   - Failure: Error message (full, duplicate, etc.)

4. **UI Update**
   - Attendee count increases
   - Button changes to "Cancel RSVP"
   - User added to attendees list

### Capacity Enforcement:

**Scenario**: Event has capacity of 50, currently 49 attendees

- ✅ User 50 can RSVP (last spot)
- ❌ User 51 cannot RSVP (full)
- ✅ If someone cancels, spot opens up

### Concurrency Handling:

**Scenario**: 5 users try to RSVP simultaneously for last spot

**What Happens**:
1. All 5 requests hit server at same time
2. MongoDB processes them atomically
3. First request succeeds (gets the spot)
4. Other 4 requests fail (event full)
5. No overbooking occurs

**Why It Works**:
- Single database operation
- Atomic check and update
- MongoDB handles locking
- No race conditions

### Duplicate Prevention:

**Scenario**: User tries to RSVP twice

- First RSVP: ✅ Success
- Second RSVP: ❌ Error "already RSVP'd"
- Database ensures uniqueness

---

## 📱 Responsive Design

### Mobile View (< 768px)
- Single column layout
- Hamburger menu
- Stacked event cards
- Touch-friendly buttons
- Optimized images

### Tablet View (768px - 1024px)
- Two column event grid
- Expanded navigation
- Balanced layout

### Desktop View (> 1024px)
- Three+ column event grid
- Full navigation bar
- Maximum content width: 1200px
- Hover effects

---

## 🎨 UI/UX Features

### Visual Feedback
- **Loading States**: Spinners during async operations
- **Error Messages**: Red background, clear text
- **Success States**: Smooth transitions
- **Hover Effects**: Cards lift on hover
- **Active States**: Button press feedback

### Color Scheme
- **Primary**: #3498db (Blue) - Actions, links
- **Success**: #27ae60 (Green) - Available spots
- **Danger**: #e74c3c (Red) - Full, delete
- **Dark**: #2c3e50 (Navy) - Navigation, headers
- **Light**: #ecf0f1 (Gray) - Backgrounds

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Readable line height (1.5-1.6)
- **Dates**: Highlighted in blue
- **Locations**: Gray with icon

### Spacing
- Consistent padding/margins
- Breathing room between elements
- Clear visual grouping

---

## 🔒 Security Features

### Authentication
- JWT tokens (7-day expiration)
- Secure password hashing
- Protected routes

### Authorization
- Owner-only edit/delete
- User-specific dashboard
- Token validation on each request

### Input Validation
- Required field checking
- Email format validation
- File type restrictions
- File size limits (5MB)
- Minimum password length (6 chars)

### Error Handling
- Graceful error messages
- No sensitive data exposed
- Proper HTTP status codes

---

## 🚀 Performance Features

### Frontend
- Component-based architecture
- Efficient re-renders
- Optimized images
- Minimal dependencies

### Backend
- Database indexes
- Atomic operations
- Efficient queries
- Proper error handling

### Database
- Indexed fields (date, creator)
- Lean queries where possible
- Connection pooling

---

## 📊 Data Flow Examples

### Creating an Event
```
User fills form → Submit → 
Frontend validates → 
API call with FormData → 
Backend validates → 
Save to MongoDB → 
Upload image → 
Return event data → 
Redirect to home
```

### RSVP Flow
```
User clicks RSVP → 
Check if logged in → 
API call with token → 
Verify token → 
Atomic DB operation → 
Check capacity → 
Add to attendees → 
Return updated event → 
Update UI
```

### Search Flow
```
User types in search → 
Submit search form → 
API call with query → 
MongoDB regex search → 
Return matching events → 
Display results
```

---

## 🎓 User Journey Examples

### New User Journey
1. Visit home page
2. Browse events
3. Click "Register"
4. Create account
5. Redirected to home
6. Click "Create Event"
7. Fill form and submit
8. Event appears on home page
9. Click event to view
10. See as creator (edit/delete options)

### Existing User Journey
1. Visit home page
2. Click "Login"
3. Enter credentials
4. Browse events
5. Click interesting event
6. Click "RSVP"
7. See confirmation
8. Visit dashboard
9. See event in "Attending" section

### Event Creator Journey
1. Login
2. Create event
3. Share event link
4. Monitor RSVPs on dashboard
5. Edit event if needed
6. View attendee list
7. Delete event after completion

---

## 💡 Tips for Best Experience

### For Users:
- Upload high-quality event images
- Write detailed descriptions
- Set realistic capacity
- Check dashboard regularly
- Cancel RSVP if can't attend

### For Developers:
- Test on multiple devices
- Verify all features work
- Check error handling
- Test concurrency
- Monitor performance

### For Deployment:
- Use environment variables
- Enable CORS properly
- Set up MongoDB Atlas
- Configure image storage
- Test production build

---

## 🎉 Feature Highlights

✨ **Intuitive Interface** - Easy to navigate and use  
✨ **Real-time Updates** - Instant feedback on actions  
✨ **Responsive Design** - Works on all devices  
✨ **Robust RSVP** - Handles concurrency perfectly  
✨ **Rich Features** - Search, filter, dashboard  
✨ **Secure** - JWT auth, validation, authorization  
✨ **Professional** - Clean code, good UX  

---

This is a complete, feature-rich event platform ready for real-world use! 🚀
