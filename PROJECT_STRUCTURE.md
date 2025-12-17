# Project Structure

```
mini-event-platform/
│
├── client/                          # React Frontend
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   │   ├── EventCard.js        # Event card component
│   │   │   ├── EventCard.css
│   │   │   ├── Navbar.js           # Navigation bar
│   │   │   ├── Navbar.css
│   │   │   └── PrivateRoute.js     # Protected route wrapper
│   │   ├── context/
│   │   │   └── AuthContext.js      # Authentication context
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.js             # Events listing page
│   │   │   ├── Home.css
│   │   │   ├── Login.js            # Login page
│   │   │   ├── Register.js         # Registration page
│   │   │   ├── Auth.css            # Auth pages styles
│   │   │   ├── CreateEvent.js      # Create event page
│   │   │   ├── EditEvent.js        # Edit event page
│   │   │   ├── EventForm.css       # Event form styles
│   │   │   ├── EventDetail.js      # Event detail page
│   │   │   ├── EventDetail.css
│   │   │   ├── Dashboard.js        # User dashboard
│   │   │   └── Dashboard.css
│   │   ├── services/
│   │   │   └── api.js              # API service layer
│   │   ├── App.js                  # Main app component
│   │   ├── App.css
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   ├── .env.example                # Environment variables template
│   └── package.json                # Frontend dependencies
│
├── server/                          # Node/Express Backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/                # Business logic
│   │   ├── authController.js       # Auth logic (register, login)
│   │   ├── eventController.js      # Event CRUD + RSVP logic
│   │   └── userController.js       # User dashboard logic
│   ├── middleware/
│   │   ├── auth.js                 # JWT authentication middleware
│   │   └── upload.js               # Multer file upload config
│   ├── models/                     # Mongoose schemas
│   │   ├── Event.js                # Event model
│   │   └── User.js                 # User model
│   ├── routes/                     # API routes
│   │   ├── auth.js                 # Auth routes
│   │   ├── events.js               # Event routes
│   │   └── users.js                # User routes
│   ├── uploads/                    # Uploaded images directory
│   │   └── .gitkeep
│   ├── .env.example                # Environment variables template
│   ├── server.js                   # Express server entry point
│   └── package.json                # Backend dependencies
│
├── .gitignore                       # Git ignore rules
├── package.json                     # Root package.json (scripts)
├── README.md                        # Main documentation
├── DEPLOYMENT.md                    # Deployment guide
├── TESTING.md                       # Concurrency testing guide
├── PROJECT_STRUCTURE.md             # This file
└── setup.bat                        # Windows setup script

```

## Key Files Explained

### Backend Core Files

**server/server.js**
- Express server setup
- Middleware configuration
- Route mounting
- Database connection

**server/controllers/eventController.js**
- **CRITICAL**: Contains the atomic RSVP logic
- Handles capacity enforcement
- Prevents race conditions using MongoDB operators

**server/models/Event.js**
- Event schema definition
- Includes attendees array for RSVP tracking
- Indexes for performance

**server/middleware/auth.js**
- JWT token verification
- Protects authenticated routes
- Attaches user to request object

### Frontend Core Files

**client/src/App.js**
- React Router setup
- Route definitions
- Auth provider wrapper

**client/src/context/AuthContext.js**
- Global authentication state
- Login/logout functions
- Token management

**client/src/services/api.js**
- Centralized API calls
- Axios configuration
- Request/response handling

**client/src/pages/EventDetail.js**
- Event details display
- RSVP/Cancel RSVP buttons
- Owner actions (edit/delete)

## Data Flow

### RSVP Flow (Critical for Concurrency)

1. User clicks "RSVP" button
2. Frontend sends POST to `/api/events/:id/rsvp`
3. Auth middleware verifies JWT token
4. Controller executes atomic MongoDB operation:
   ```javascript
   Event.findOneAndUpdate(
     { _id, $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] } },
     { $addToSet: { attendees: userId } }
   )
   ```
5. MongoDB ensures atomicity (no race conditions)
6. Response sent back to frontend
7. UI updates with new attendee count

### Authentication Flow

1. User submits login/register form
2. Backend validates credentials
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Token included in all authenticated requests
6. Middleware verifies token on each request

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-platform
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login user |
| GET | /api/events | No | Get all events |
| GET | /api/events/:id | No | Get single event |
| POST | /api/events | Yes | Create event |
| PUT | /api/events/:id | Yes | Update event (owner only) |
| DELETE | /api/events/:id | Yes | Delete event (owner only) |
| POST | /api/events/:id/rsvp | Yes | RSVP to event |
| DELETE | /api/events/:id/rsvp | Yes | Cancel RSVP |
| GET | /api/users/dashboard | Yes | Get user dashboard |

## Technology Choices Explained

### Why MongoDB?
- Flexible schema for events
- Atomic operations for concurrency
- Easy to scale
- Free tier on Atlas

### Why JWT?
- Stateless authentication
- Works well with React
- Easy to implement
- Scalable (no server-side sessions)

### Why Multer?
- Standard for file uploads in Express
- Easy configuration
- Good documentation

### Why Context API?
- Built into React
- Sufficient for this app size
- No extra dependencies
- Easy to understand

## Performance Considerations

1. **Database Indexes**: Added on `date` and `creator` fields
2. **Atomic Operations**: Single DB query for RSVP
3. **Image Optimization**: File size limits (5MB)
4. **Pagination**: Can be added for large event lists

## Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Expiration**: 7-day token expiry
3. **Input Validation**: Required fields enforced
4. **File Type Validation**: Only images allowed
5. **Authorization Checks**: Owner-only edit/delete
6. **CORS Configuration**: Controlled origins

## Future Enhancements

- [ ] Email notifications
- [ ] Event categories/tags
- [ ] Calendar integration
- [ ] Social sharing
- [ ] Event comments/reviews
- [ ] Payment integration
- [ ] Real-time updates (Socket.io)
- [ ] Advanced search filters
- [ ] Event recommendations
- [ ] Mobile app (React Native)
