import React, { useState, useEffect } from 'react';
import { Bell, Heart, Smile } from 'lucide-react';
import { mockDataEngine } from '../utils/mockDataEngine';

interface HeaderProps {
  currentView: string;
  role: 'admin' | 'parent';
  onRoleChange: (role: 'admin' | 'parent') => void;
  onShowNoticeBoard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  role,
  onRoleChange,
  onShowNoticeBoard
}) => {
  const [noticesCount, setNoticesCount] = useState(0);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    // Fetch notices count
    const notices = mockDataEngine.getNotices();
    setNoticesCount(notices.length);

    // Live clock ticker
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const handleRoleToggle = () => {
    const nextRole = role === 'admin' ? 'parent' : 'admin';
    mockDataEngine.setCurrentRole(nextRole);
    onRoleChange(nextRole);
  };

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return role === 'admin' 
          ? "Kidza Admin Board 🏫" 
          : "Parent Portal 🧸";
      case 'classes': return "Kindergarten Classes 🎨";
      case 'students': return "Student Register 👶";
      case 'teachers': return "Our Teachers 👩‍🏫";
      case 'events': return "School Events Calendar 🎈";
      case 'shop': return "Kidza Store & Shop 🎒";
      case 'notices': return "Parent Notice Board 📢";
      default: return "Kidza Portal";
    }
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 8px',
        marginBottom: '24px',
        borderBottom: '2px solid #F1ECE6',
        flexWrap: 'wrap',
        gap: '16px'
      }}
    >
      {/* Title Area */}
      <div>
        <h1 
          style={{ 
            fontSize: '1.8rem', 
            fontWeight: '900', 
            color: '#3D4A59',
            fontFamily: "'Fredoka', sans-serif"
          }}
        >
          {getTitle()}
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#8E9FAA', fontWeight: '600' }}>
          {role === 'admin' 
            ? "Manage classrooms, log attendance, and coordinate teacher-parent chats."
            : "Review Aarav's daily reports, check fees, and buy school supplies."
          }
        </p>
      </div>

      {/* Quick Action Elements */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        
        {/* Playful Role Toggle */}
        <button
          onClick={handleRoleToggle}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: role === 'admin' 
              ? 'linear-gradient(135deg, #FF6B6B15, #FF6B6B30)' 
              : 'linear-gradient(135deg, #4D96FF15, #4D96FF30)',
            border: `2px dashed ${role === 'admin' ? '#FF6B6B' : '#4D96FF'}`,
            color: role === 'admin' ? '#FF6B6B' : '#4D96FF',
            padding: '8px 16px',
            borderRadius: '14px',
            fontWeight: '800',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontFamily: "'Fredoka', sans-serif",
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.25)'
          }}
          className="role-toggle-btn"
        >
          {role === 'admin' ? <Smile size={16} /> : <Heart size={16} />}
          <span>View as: {role === 'admin' ? 'Principal / Admin' : 'Parent'}</span>
        </button>

        {/* Live Clock Badge */}
        <div
          style={{
            background: '#FFFFFF',
            border: '2px solid #F1ECE6',
            padding: '8px 16px',
            borderRadius: '14px',
            fontSize: '0.85rem',
            fontWeight: '700',
            color: '#5A6E7F',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6BCB77', display: 'inline-block' }} />
          <span>Live Clock: {time}</span>
        </div>

        {/* Notices Bell Alert */}
        <button
          onClick={onShowNoticeBoard}
          style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            border: '2px solid #F1ECE6',
            backgroundColor: '#FFFFFF',
            color: '#5A6E7F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          className="header-bell-btn"
        >
          <Bell size={18} />
          {noticesCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#FF6B6B',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: '900',
                padding: '2px 6px',
                borderRadius: '99px',
                border: '2px solid #FFFFFF'
              }}
            >
              {noticesCount}
            </span>
          )}
        </button>

        {/* Principal Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={role === 'admin' 
                ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" // Principal
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" // Parent Datta
              }
              alt="Avatar"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                border: '2.5px solid #FFD93D',
                objectFit: 'cover'
              }}
            />
            <div 
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                backgroundColor: '#6BCB77',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '2px solid #FFFFFF'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#3D4A59' }}>
              {role === 'admin' ? "Principal Lawson" : "Datta Panchal"}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#8E9FAA', fontWeight: '700' }}>
              {role === 'admin' ? "School Admin" : "Aarav's Parent"}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
