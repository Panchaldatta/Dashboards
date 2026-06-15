import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  UserSquare2, 
  Calendar, 
  ShoppingBag, 
  ClipboardList, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isOpen,
  onToggle
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#FF6B6B' },
    { id: 'classes', label: 'Classes', icon: GraduationCap, color: '#FFD93D' },
    { id: 'students', label: 'Students', icon: Users, color: '#4D96FF' },
    { id: 'teachers', label: 'Teachers', icon: UserSquare2, color: '#6BCB77' },
    { id: 'events', label: 'Events', icon: Calendar, color: '#9B72AA' },
    { id: 'shop', label: 'Kidza Store', icon: ShoppingBag, color: '#FF6B6B' },
    { id: 'notices', label: 'Notice Board', icon: ClipboardList, color: '#4D96FF' },
  ];

  return (
    <aside 
      style={{
        width: isOpen ? '280px' : '90px',
        backgroundColor: '#FFFFFF',
        borderRight: '3px solid #F1ECE6',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
        overflow: 'hidden'
      }}
    >
      {/* Brand Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '36px',
          paddingLeft: '6px',
          position: 'relative'
        }}
      >
        {/* Playful Logo Icon */}
        <div 
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #FF6B6B, #FFD93D)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: '900',
            fontSize: '1.4rem',
            fontFamily: "'Fredoka', sans-serif",
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(255, 107, 107, 0.3)',
            border: '2px solid #FFFFFF'
          }}
        >
          K
        </div>
        
        {isOpen && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span 
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '1.6rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #FF6B6B, #9B72AA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
                lineHeight: '1.2'
              }}
            >
              Kidza
            </span>
            <span 
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#8E9FAA',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Pre-School Portal
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? `${item.color}15` : 'transparent',
                color: isActive ? '#3D4A59' : '#8E9FAA',
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: isActive ? '800' : '600',
                fontSize: '1rem',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2)',
                position: 'relative'
              }}
              className="sidebar-btn"
            >
              {/* Highlight bar for active view */}
              {isActive && (
                <div 
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    height: '60%',
                    width: '5px',
                    borderRadius: '0 4px 4px 0',
                    backgroundColor: item.color
                  }}
                />
              )}
              
              <Icon 
                size={22} 
                style={{ 
                  color: isActive ? item.color : '#8E9FAA',
                  transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.5)',
                  transform: isActive ? 'scale(1.15) rotate(-3deg)' : 'none'
                }} 
              />
              
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Premium Badge / Teacher Assist info */}
      {isOpen && (
        <div 
          style={{
            background: 'linear-gradient(135deg, #FDF9F2, #FFF3F3)',
            borderRadius: '20px',
            padding: '16px',
            border: '2px dashed #EEDFCE',
            position: 'relative',
            marginBottom: '20px',
            overflow: 'hidden'
          }}
          className="animate-float"
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Sparkles size={16} color="#FF6B6B" />
              <span style={{ fontWeight: '800', fontSize: '0.85rem', color: '#FF6B6B' }}>Fun Fact of Day</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#5A6E7F', lineHeight: '1.4', fontWeight: '500' }}>
              Play-based learning improves a child's brain development and linguistic capability by up to 30%!
            </p>
          </div>
          <div 
            style={{
              position: 'absolute',
              right: '-10px',
              bottom: '-10px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#FFD93D30'
            }}
          />
        </div>
      )}

      {/* Collapse Trigger Button */}
      <button 
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '10px 0',
          borderRadius: '14px',
          border: '2px solid #F1ECE6',
          backgroundColor: '#FFFFFF',
          color: '#8E9FAA',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        className="collapse-btn"
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </aside>
  );
};
