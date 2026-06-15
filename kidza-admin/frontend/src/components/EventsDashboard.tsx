import React, { useEffect, useState } from 'react';
import { Plus, X, Calendar, Clock, MapPin } from 'lucide-react';
import { mockDataEngine } from '../utils/mockDataEngine';
import type { SchoolEvent } from '../utils/mockDataEngine';

interface EventsDashboardProps {
  role: 'admin' | 'parent';
}

export const EventsDashboard: React.FC<EventsDashboardProps> = ({ role }) => {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<'pink' | 'yellow' | 'blue' | 'green' | 'purple'>('pink');

  const fetchEvents = () => {
    setEvents(mockDataEngine.getEvents());
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !location) return;

    mockDataEngine.addEvent({
      title,
      date,
      time,
      location,
      description,
      color
    });

    // Reset Form
    setTitle('');
    setDate('');
    setLocation('');
    setDescription('');
    setShowModal(false);
    fetchEvents();
  };

  // Calculate days remaining dynamically
  const getDaysRemaining = (eventDateStr: string) => {
    const today = new Date('2026-06-15'); // Current Mock Local Time
    const eventDate = new Date(eventDateStr);
    
    // Reset hours
    today.setHours(0,0,0,0);
    eventDate.setHours(0,0,0,0);

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today! 🎉';
    if (diffDays < 0) return 'Passed 🗓';
    return `${diffDays} Days Left ⏳`;
  };

  const getColorHex = (c: SchoolEvent['color']) => {
    switch(c) {
      case 'pink': return '#FF6B6B';
      case 'yellow': return '#FFD93D';
      case 'blue': return '#4D96FF';
      case 'green': return '#6BCB77';
      case 'purple': return '#9B72AA';
      default: return '#FF6B6B';
    }
  };

  const getColorBg = (c: SchoolEvent['color']) => {
    switch(c) {
      case 'pink': return '#FFF0F0';
      case 'yellow': return '#FFFDF0';
      case 'blue': return '#F0F6FF';
      case 'green': return '#F0FFF2';
      case 'purple': return '#F8F2FC';
      default: return '#FFF0F0';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header action block */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#3D4A59' }}>School Events & Excursions</h2>
          <p style={{ fontSize: '0.85rem', color: '#8E9FAA', fontWeight: '600' }}>Upcoming activities and school holidays schedules.</p>
        </div>

        {role === 'admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="kid-btn btn-primary"
          >
            <Plus size={18} />
            <span>Schedule New Event</span>
          </button>
        )}
      </div>

      {/* Events Grid */}
      <div className="kid-grid kid-grid-2">
        {events.map((event) => {
          const colorHex = getColorHex(event.color);
          const colorBg = getColorBg(event.color);
          const countdownText = getDaysRemaining(event.date);
          
          return (
            <div 
              key={event.id} 
              className="kid-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                borderLeft: `8px solid ${colorHex}`
              }}
            >
              <div>
                {/* Header: Date Badge & Countdown */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} style={{ color: colorHex }} />
                    <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#3D4A59' }}>
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <span 
                    className="kid-badge" 
                    style={{ backgroundColor: colorBg, color: colorHex === '#FFD93D' ? '#D4AF37' : colorHex }}
                  >
                    {countdownText}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#3D4A59', marginBottom: '8px' }}>
                  {event.title}
                </h3>
                
                <p style={{ fontSize: '0.85rem', color: '#5A6E7F', lineHeight: '1.5', marginBottom: '16px' }}>
                  {event.description}
                </p>
              </div>

              {/* Event Location and Timings */}
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  flexWrap: 'wrap',
                  borderTop: '1.5px dashed #F1ECE6', 
                  paddingTop: '12px' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', color: '#8E9FAA' }}>
                  <Clock size={14} style={{ color: colorHex }} />
                  <span>{event.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', color: '#8E9FAA' }}>
                  <MapPin size={14} style={{ color: colorHex }} />
                  <span>{event.location}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(61, 74, 89, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            className="kid-card animate-float"
            style={{
              width: '100%',
              maxWidth: '550px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar color="#FF6B6B" />
                <span>Schedule New Event</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8E9FAA' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Event Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g. Summer Excursion Zoo Picnic" 
                  className="kid-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    className="kid-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Timings (Clock)</label>
                  <input 
                    type="text" 
                    value={time} 
                    onChange={e => setTime(e.target.value)} 
                    placeholder="e.g. 09:00 AM - 01:00 PM" 
                    className="kid-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Event Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  placeholder="e.g. City Zoo or School Hall" 
                  className="kid-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Event Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Describe the activities, items to bring, or schedule breakdown..." 
                  className="kid-input"
                  rows={3}
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              {/* Theme Color Selector */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Event Style Theme Color</label>
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                  {(['pink', 'yellow', 'blue', 'green', 'purple'] as const).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setColor(col)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: getColorHex(col),
                        border: color === col ? '3.5px solid #3D4A59' : '2px solid #FFFFFF',
                        cursor: 'pointer',
                        transform: color === col ? 'scale(1.15)' : 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="kid-btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="kid-btn btn-primary"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
