const Event = require('../models/Event');

// Get user dashboard data
exports.getDashboard = async (req, res) => {
  try {
    // Events created by user
    const createdEvents = await Event.find({ creator: req.userId })
      .populate('attendees', 'name email')
      .sort({ date: 1 });

    // Events user is attending
    const attendingEvents = await Event.find({ attendees: req.userId })
      .populate('creator', 'name email')
      .populate('attendees', 'name email')
      .sort({ date: 1 });

    res.json({
      createdEvents,
      attendingEvents
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
