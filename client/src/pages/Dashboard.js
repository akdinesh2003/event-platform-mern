import React, { useState, useEffect } from 'react';
import { getDashboard } from '../services/api';
import EventCard from '../components/EventCard';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState({ createdEvents: [], attendingEvents: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h1>My Dashboard</h1>

      <section className="dashboard-section">
        <h2>Events I Created ({data.createdEvents.length})</h2>
        {data.createdEvents.length === 0 ? (
          <p className="empty-message">You haven't created any events yet.</p>
        ) : (
          <div className="events-grid">
            {data.createdEvents.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Events I'm Attending ({data.attendingEvents.length})</h2>
        {data.attendingEvents.length === 0 ? (
          <p className="empty-message">You haven't RSVP'd to any events yet.</p>
        ) : (
          <div className="events-grid">
            {data.attendingEvents.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
