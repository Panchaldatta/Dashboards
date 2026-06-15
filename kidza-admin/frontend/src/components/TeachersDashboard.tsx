import React, { useEffect, useState } from 'react';
import { Mail, Star, Award, MessageSquareCode, Heart } from 'lucide-react';
import { mockDataEngine } from '../utils/mockDataEngine';
import type { Teacher } from '../utils/mockDataEngine';

interface TeachersDashboardProps {
  onNavigateToChat: () => void;
}

export const TeachersDashboard: React.FC<TeachersDashboardProps> = ({ onNavigateToChat }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const fetchTeachers = () => {
    setTeachers(mockDataEngine.getTeachers());
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleRateTeacher = (tId: string, rating: number) => {
    mockDataEngine.rateTeacher(tId, rating);
    fetchTeachers();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#3D4A59' }}>School Educators & Coordinators</h2>
        <p style={{ fontSize: '0.85rem', color: '#8E9FAA', fontWeight: '600' }}>Review faculty experience, assigned classes, and parent ratings.</p>
      </div>

      {/* Teachers Grid */}
      <div className="kid-grid kid-grid-2">
        {teachers.map((teacher) => {
          return (
            <div 
              key={teacher.id} 
              className="kid-card"
              style={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                alignItems: 'flex-start'
              }}
            >
              {/* Profile Image & Rating */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '8px',
                  minWidth: '120px'
                }}
              >
                <img 
                  src={teacher.avatar} 
                  alt={teacher.name} 
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '24px',
                    objectFit: 'cover',
                    border: '4px solid #F1ECE6',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
                  }}
                />
                
                {/* Rating Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '800', color: '#FFD93D' }}>
                  <Star size={16} fill="#FFD93D" />
                  <span style={{ color: '#3D4A59' }}>{teacher.rating} / 5.0</span>
                </div>
              </div>

              {/* Bio Details */}
              <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#3D4A59' }}>
                    {teacher.name}
                  </h3>
                  <span 
                    className="kid-badge badge-purple"
                    style={{ marginTop: '4px' }}
                  >
                    {teacher.subject}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#5A6E7F', lineHeight: '1.4', fontStyle: 'italic' }}>
                  "{teacher.bio}"
                </p>

                {/* Meta properties */}
                <div 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '4px', 
                    fontSize: '0.8rem', 
                    fontWeight: '700', 
                    color: '#8E9FAA',
                    marginTop: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={14} color="#9B72AA" />
                    <span>Experience: {teacher.experience}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Heart size={14} color="#FF6B6B" />
                    <span>Classes: {teacher.classes.join(', ')}</span>
                  </div>
                </div>

                {/* Rating Click Interface */}
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    marginTop: '8px',
                    borderTop: '1.5px solid #F1ECE6',
                    paddingTop: '12px'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#8E9FAA' }}>Rate Teacher:</span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRateTeacher(teacher.id, star)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                      >
                        <Star 
                          size={14} 
                          fill={star <= Math.round(teacher.rating) ? "#FFD93D" : "none"} 
                          color="#FFD93D" 
                        />
                      </button>
                    ))}
                  </div>

                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                    <a 
                      href={`mailto:${teacher.email}`}
                      style={{
                        padding: '6px',
                        borderRadius: '10px',
                        border: '1.5px solid #F1ECE6',
                        color: '#8E9FAA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Email teacher"
                    >
                      <Mail size={15} />
                    </a>
                    <button 
                      onClick={onNavigateToChat}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '10px',
                        backgroundColor: '#6BCB7715',
                        border: '1.5px solid #6BCB77',
                        color: '#6BCB77',
                        fontWeight: '800',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <MessageSquareCode size={13} />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
