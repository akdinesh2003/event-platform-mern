const Event = require('../models/Event');

// Get all events with optional search/filter
exports.getEvents = async (req, res) => {
  try {
    const { search, upcoming } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('creator', 'name email')
      .populate('attendees', 'name email')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, capacity } = req.body;

    const event = new Event({
      title,
      description,
      date,
      location,
      capacity,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      creator: req.userId
    });

    await event.save();
    await event.populate('creator', 'name email');

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check ownership
    if (event.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const { title, description, date, location, capacity } = req.body;

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.capacity = capacity || event.capacity;

    if (req.file) {
      event.image = `/uploads/${req.file.filename}`;
    }

    await event.save();
    await event.populate('creator', 'name email');
    await event.populate('attendees', 'name email');

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check ownership
    if (event.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// RSVP to event - WITH ATOMIC OPERATION FOR CONCURRENCY HANDLING
exports.rsvpEvent = async (req, res) => {
  try {
    // Use findOneAndUpdate with atomic operators to prevent race conditions
    const event = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        // Check capacity atomically
        $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] },
        // Ensure user hasn't already RSVP'd
        attendees: { $ne: req.userId }
      },
      {
        // Add user to attendees atomically
        $addToSet: { attendees: req.userId }
      },
      { new: true }
    )
    .populate('creator', 'name email')
    .populate('attendees', 'name email');

    if (!event) {
      return res.status(400).json({ 
        message: 'Cannot RSVP: Event is full, not found, or you have already RSVP\'d' 
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel RSVP
exports.cancelRsvp = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { attendees: req.userId } },
      { new: true }
    )
    .populate('creator', 'name email')
    .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
