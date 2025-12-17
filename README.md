# Mini Event Platform - MERN Stack

A full-stack event management platform where users can create events, RSVP to events, and manage their participation.

## Features Implemented

### Core Features
- ✅ User Authentication (JWT-based)
  - Sign up and login with secure password hashing
  - Token-based session management
- ✅ Event Management (CRUD)
  - Create events with title, description, date, location, capacity, and image
  - View all upcoming events
  - Edit and delete own events only
- ✅ RSVP System with Concurrency Handling
  - Join/leave events with capacity enforcement
  - Race condition prevention using MongoDB atomic operations
  - No duplicate RSVPs per user
- ✅ Responsive UI
  - Mobile-first design
  - Works seamlessly on desktop, tablet, and mobile

### Bonus Features
- ✅ User Dashboard showing created events and RSVPs
- ✅ Search and filter events
- ✅ Image upload for events

## Technical Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Deployment**: 
  - Frontend: Vercel/Netlify
  - Backend: Render/Railway
  - Database: MongoDB Atlas

## Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection string)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Concurrency & Capacity Handling - Technical Explanation

### The Challenge
When multiple users attempt to RSVP to an event simultaneously, especially for the last available spot, race conditions can occur leading to overbooking.

### Solution: MongoDB Atomic Operations

We use MongoDB's `findOneAndUpdate` with atomic operators to ensure thread-safe RSVP operations:

```javascript
// RSVP to Event - Atomic Operation
const event = await Event.findOneAndUpdate(
  {
    _id: eventId,
    $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] }, // Check capacity
    attendees: { $ne: userId } // Ensure user hasn't already RSVP'd
  },
  {
    $addToSet: { attendees: userId } // Add user atomically
  },
  { new: true }
);
```

**Key Points:**
1. **Single Atomic Operation**: The capacity check and user addition happen in one database operation
2. **$expr with $size**: Ensures current attendee count is less than capacity
3. **$ne (not equal)**: Prevents duplicate RSVPs
4. **$addToSet**: Adds user only if not already present (double protection)
5. **No Race Conditions**: MongoDB handles concurrent requests at the database level

This approach eliminates the need for:
- Application-level locks
- Transactions (though we could use them for multi-document operations)
- Manual capacity checking followed by updates (which would be vulnerable to race conditions)

### Leave Event - Atomic Operation
```javascript
const event = await Event.findOneAndUpdate(
  { _id: eventId },
  { $pull: { attendees: userId } },
  { new: true }
);
```

The `$pull` operator atomically removes the user from the attendees array.

## Deployment

### Backend Deployment (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Add environment variable: `REACT_APP_API_URL`

### Database (MongoDB Atlas)
1. Create a free cluster on MongoDB Atlas
2. Whitelist IP addresses (0.0.0.0/0 for development)
3. Create database user
4. Get connection string and add to backend `.env`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get all events (with optional search/filter)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (authenticated)
- `PUT /api/events/:id` - Update event (authenticated, owner only)
- `DELETE /api/events/:id` - Delete event (authenticated, owner only)

### RSVP
- `POST /api/events/:id/rsvp` - RSVP to event (authenticated)
- `DELETE /api/events/:id/rsvp` - Cancel RSVP (authenticated)

### User
- `GET /api/users/dashboard` - Get user's created events and RSVPs (authenticated)

## Project Structure

```
mini-event-platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth context
│   │   ├── services/      # API services
│   │   └── App.js
│   └── package.json
├── server/                # Node/Express backend
│   ├── config/           # Database config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── uploads/          # Uploaded images
│   └── server.js
└── README.md
```

## License

MIT
