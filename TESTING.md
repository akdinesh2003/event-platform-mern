# Testing the Concurrency Handling

This document explains how to test the RSVP concurrency handling to verify that race conditions are properly prevented.

## The Problem

When multiple users try to RSVP to an event simultaneously (especially for the last available spot), without proper handling, the system could allow more attendees than the capacity allows.

## Our Solution

We use MongoDB's atomic operations with `findOneAndUpdate` to ensure thread-safe RSVP operations:

```javascript
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

## How to Test

### Manual Testing (Simple)

1. Create an event with capacity of 2
2. Open the event page in 2 different browsers (or incognito windows)
3. Login as different users in each browser
4. Click RSVP simultaneously in both browsers
5. Verify that only 2 users can RSVP (the third attempt should fail)

### Automated Testing (Advanced)

Create a test script to simulate concurrent requests:

```javascript
// test-concurrency.js
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const EVENT_ID = 'your-event-id';

// Create multiple users and tokens first
const users = [
  { token: 'user1-token' },
  { token: 'user2-token' },
  { token: 'user3-token' },
  { token: 'user4-token' },
  { token: 'user5-token' }
];

async function testConcurrentRSVP() {
  console.log('Testing concurrent RSVP...');
  
  // Send all RSVP requests simultaneously
  const promises = users.map(user => 
    axios.post(`${API_URL}/events/${EVENT_ID}/rsvp`, {}, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    .then(() => ({ success: true }))
    .catch(err => ({ success: false, error: err.response?.data?.message }))
  );

  const results = await Promise.all(promises);
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Successful RSVPs: ${successful}`);
  console.log(`Failed RSVPs: ${failed}`);
  console.log('Results:', results);
}

testConcurrentRSVP();
```

### Load Testing (Professional)

Use tools like Apache JMeter or Artillery:

```yaml
# artillery-test.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 10
      arrivalRate: 20
scenarios:
  - name: "Concurrent RSVP"
    flow:
      - post:
          url: "/api/events/{{eventId}}/rsvp"
          headers:
            Authorization: "Bearer {{token}}"
```

Run: `artillery run artillery-test.yml`

## Expected Results

- ✅ Only the exact number of users equal to capacity should be able to RSVP
- ✅ Additional RSVP attempts should receive an error message
- ✅ No "overbooking" should occur
- ✅ Database should remain consistent

## Why This Works

1. **Atomic Operation**: The check and update happen in a single database operation
2. **$expr with $size**: Evaluates the current array size against capacity in the query
3. **$addToSet**: Only adds if not already present (prevents duplicates)
4. **MongoDB Locking**: MongoDB handles concurrent writes to the same document

## Alternative Approaches

### 1. MongoDB Transactions (More Complex)
```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  const event = await Event.findById(eventId).session(session);
  if (event.attendees.length >= event.capacity) {
    throw new Error('Event is full');
  }
  event.attendees.push(userId);
  await event.save({ session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

### 2. Redis Locks (Distributed Systems)
For multi-server deployments, use Redis for distributed locking.

### 3. Optimistic Locking (Version Field)
Add a version field and retry on conflicts.

## Conclusion

Our atomic operation approach is:
- ✅ Simple and clean
- ✅ Performant (single DB operation)
- ✅ Reliable (MongoDB guarantees atomicity)
- ✅ Scalable (works with multiple server instances)

This is the recommended approach for this use case.
