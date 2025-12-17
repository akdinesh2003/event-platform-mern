import React from 'react';
import { Link } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event }) => {
  const API_URL = process.env.REACT_APP_API_URL || '';
  const imageUrl = event.image ? `${API_URL.replace('/api', '')}${event.image}` : null;
  const spotsLeft = event.capacity - event.attendees.length;
  const isFull = spotsLeft <= 0;

  return (
    <Link to={`/events/${event._id}`} className="event-card">
      {imageUrl && (
        <div className="event-image">
          <img src={imageUrl} alt={event.title} />
        </div>
      )}
      <div className="event-content">
        <h3>{event.title}</h3>
        <p className="event-date">{new Date(event.date).toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p className="event-location">📍 {event.location}</p>
        <p className="event-description">{event.description.substring(0, 100)}...</p>
        <div className="event-footer">
          <span className={`capacity ${isFull ? 'full' : ''}`}>
            {isFull ? 'FULL' : `${spotsLeft} spots left`}
          </span>
          <span className="attendees">{event.attendees.length}/{event.capacity} attending</span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
