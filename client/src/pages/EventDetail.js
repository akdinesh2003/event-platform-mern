import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEvent, rsvpEvent, cancelRsvp, deleteEvent } from '../services/api';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await getEvent(id);
      setEvent(response.data);
    } catch (error) {
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setActionLoading(true);
    setError('');
    try {
      const response = await rsvpEvent(id);
      setEvent(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to RSVP');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRSVP = async () => {
    setActionLoading(true);
    setError('');
    try {
      const response = await cancelRsvp(id);
      setEvent(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel RSVP');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        navigate('/');
      } catch (error) {
        setError('Failed to delete event');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!event) return <div className="error">Event not found</div>;

  const API_URL = process.env.REACT_APP_API_URL || '';
  const imageUrl = event.image ? `${API_URL.replace('/api', '')}${event.image}` : null;
  const isCreator = user && event.creator._id === user.id;
  const hasRSVPd = user && event.attendees.some(a => a._id === user.id);
  const isFull = event.attendees.length >= event.capacity;

  return (
    <div className="event-detail">
      {imageUrl && (
        <div className="detail-image">
          <img src={imageUrl} alt={event.title} />
        </div>
      )}

      <div className="detail-content">
        <h1>{event.title}</h1>
        
        <div className="detail-meta">
          <p className="detail-date">
            📅 {new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className="detail-location">📍 {event.location}</p>
          <p className="detail-creator">👤 Created by {event.creator.name}</p>
        </div>

        <div className="detail-description">
          <h3>About this event</h3>
          <p>{event.description}</p>
        </div>

        <div className="detail-capacity">
          <h3>Capacity</h3>
          <p>{event.attendees.length} / {event.capacity} attending</p>
          {isFull && <span className="full-badge">EVENT FULL</span>}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="detail-actions">
          {isCreator ? (
            <>
              <Link to={`/edit-event/${event._id}`} className="btn btn-edit">Edit Event</Link>
              <button onClick={handleDelete} className="btn btn-delete">Delete Event</button>
            </>
          ) : (
            <>
              {hasRSVPd ? (
                <button onClick={handleCancelRSVP} disabled={actionLoading} className="btn btn-cancel">
                  {actionLoading ? 'Processing...' : 'Cancel RSVP'}
                </button>
              ) : (
                <button onClick={handleRSVP} disabled={actionLoading || isFull} className="btn btn-rsvp">
                  {actionLoading ? 'Processing...' : isFull ? 'Event Full' : 'RSVP to Event'}
                </button>
              )}
            </>
          )}
        </div>

        {event.attendees.length > 0 && (
          <div className="attendees-list">
            <h3>Attendees ({event.attendees.length})</h3>
            <ul>
              {event.attendees.map(attendee => (
                <li key={attendee._id}>{attendee.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
