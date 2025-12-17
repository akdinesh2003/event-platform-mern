const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRsvp
} = require('../controllers/eventController');

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', auth, upload.single('image'), createEvent);
router.put('/:id', auth, upload.single('image'), updateEvent);
router.delete('/:id', auth, deleteEvent);
router.post('/:id/rsvp', auth, rsvpEvent);
router.delete('/:id/rsvp', auth, cancelRsvp);

module.exports = router;
