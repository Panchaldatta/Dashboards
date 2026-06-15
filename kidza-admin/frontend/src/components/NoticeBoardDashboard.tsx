import React, { useEffect, useState, useRef } from 'react';
import { Plus, X, Send, Megaphone } from 'lucide-react';
import { mockDataEngine } from '../utils/mockDataEngine';
import type { SchoolNotice, ChatMessage } from '../utils/mockDataEngine';

interface NoticeBoardDashboardProps {
  role: 'admin' | 'parent';
}

export const NoticeBoardDashboard: React.FC<NoticeBoardDashboardProps> = ({ role }) => {
  const [notices, setNotices] = useState<SchoolNotice[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showModal, setShowModal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Form State for new notice
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'urgent' | 'general' | 'holiday' | 'event'>('general');
  const [postedBy, setPostedBy] = useState(role === 'admin' ? 'Principal Lawson' : 'Parent Datta');

  // Chat Input State
  const [typedMessage, setTypedMessage] = useState('');

  const fetchNoticesAndMessages = () => {
    setNotices(mockDataEngine.getNotices());
    setMessages(mockDataEngine.getMessages());
  };

  useEffect(() => {
    fetchNoticesAndMessages();
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    mockDataEngine.addNotice({
      title,
      content,
      category,
      postedBy
    });

    setTitle('');
    setContent('');
    setShowModal(false);
    fetchNoticesAndMessages();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const sender = role === 'admin' ? 'principal' : 'parent';
    mockDataEngine.sendMessage(sender, typedMessage.trim());
    setTypedMessage('');
    fetchNoticesAndMessages();
  };

  const getCategoryColor = (cat: SchoolNotice['category']) => {
    switch(cat) {
      case 'urgent': return { color: '#FF6B6B', bg: '#FFF0F0' };
      case 'holiday': return { color: '#FFD93D', bg: '#FFFDF0' };
      case 'event': return { color: '#4D96FF', bg: '#F0F6FF' };
      case 'general': return { color: '#6BCB77', bg: '#F0FFF2' };
      default: return { color: '#6BCB77', bg: '#F0FFF2' };
    }
  };

  return (
    <div 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '24px' 
      }}
    >
      
      {/* Column Left: Announcement Notice Board */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#3D4A59' }}>School Announcements</h2>
            <p style={{ fontSize: '0.8rem', color: '#8E9FAA', fontWeight: '600' }}>Principal announcements & daily alerts.</p>
          </div>

          {role === 'admin' && (
            <button 
              onClick={() => {
                setPostedBy('Principal Lawson');
                setShowModal(true);
              }}
              style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '0.78rem' }}
              className="kid-btn btn-primary"
            >
              <Plus size={14} />
              <span>Post Notice</span>
            </button>
          )}
        </div>

        {/* Notices Scroll Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
          {notices.map((notice) => {
            const theme = getCategoryColor(notice.category);
            
            return (
              <div 
                key={notice.id} 
                className="kid-card"
                style={{ borderLeft: `6px solid ${theme.color}`, padding: '16px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span 
                    className="kid-badge" 
                    style={{ backgroundColor: theme.bg, color: notice.category === 'holiday' ? '#D4AF37' : theme.color }}
                  >
                    {notice.category}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#8E9FAA', fontWeight: '800' }}>
                    {notice.date}
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#3D4A59', marginBottom: '6px' }}>
                  {notice.title}
                </h3>
                
                <p style={{ fontSize: '0.82rem', color: '#5A6E7F', lineHeight: '1.4', marginBottom: '10px' }}>
                  {notice.content}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.72rem', color: '#8E9FAA', fontWeight: '800' }}>
                  <span>Posted by: {notice.postedBy}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Column Right: Interactive Parent-Teacher Chat Interface */}
      <div 
        className="kid-card" 
        style={{ 
          height: '75vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          padding: '20px'
        }}
      >
        {/* Chat Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '2px solid #F1ECE6', paddingBottom: '12px', marginBottom: '12px' }}>
          <img 
            src={role === 'admin' 
              ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" // Parent Datta
              : "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100" // Principal Ruby Lawson
            }
            alt="Chat partner"
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#3D4A59' }}>
              {role === 'admin' ? 'Parent: Datta Panchal' : 'Miss Ruby Lawson'}
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#6BCB77', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6BCB77' }} />
              Online (Aarav's class coordinator)
            </span>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div 
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            paddingRight: '4px',
            marginBottom: '12px'
          }}
        >
          {messages.map((msg) => {
            const isMe = (role === 'admin' && msg.sender === 'principal') || 
                         (role === 'parent' && msg.sender === 'parent');
            
            return (
              <div 
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                <div 
                  style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    backgroundColor: isMe ? '#FF6B6B' : '#F0F6FF',
                    color: isMe ? '#FFFFFF' : '#3D4A59',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                    border: isMe ? 'none' : '1.5px solid #D1E3FF'
                  }}
                >
                  <p style={{ fontSize: '0.85rem', fontWeight: '600', lineHeight: '1.4' }}>{msg.text}</p>
                  <span 
                    style={{ 
                      fontSize: '0.68rem', 
                      color: isMe ? '#FFFFFFB0' : '#8E9FAA', 
                      fontWeight: '800',
                      display: 'block',
                      textAlign: 'right',
                      marginTop: '4px'
                    }}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Form */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={typedMessage}
            onChange={e => setTypedMessage(e.target.value)}
            placeholder="Type your message..."
            className="kid-input"
            style={{ flex: 1 }}
          />
          <button 
            type="submit"
            className="kid-btn btn-primary"
            style={{ padding: '10px 14px', borderRadius: '12px' }}
          >
            <Send size={16} />
          </button>
        </form>

      </div>

      {/* Post Notice Form Modal */}
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
              maxWidth: '500px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Megaphone color="#FF6B6B" />
                <span>Post School Notice</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8E9FAA' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateNotice}>
              <div className="form-group">
                <label>Announcement Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g. Field Trip Permissions Due" 
                  className="kid-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Notice Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value as any)}
                  className="kid-input"
                >
                  <option value="general">General Notice</option>
                  <option value="urgent">Urgent Warning</option>
                  <option value="holiday">Holiday Announcement</option>
                  <option value="event">Event Notice</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Announcement Details</label>
                <textarea 
                  value={content} 
                  onChange={e => setContent(e.target.value)} 
                  placeholder="Provide all relevant details to parents..." 
                  className="kid-input"
                  rows={4}
                  style={{ resize: 'vertical' }}
                  required
                />
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
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
