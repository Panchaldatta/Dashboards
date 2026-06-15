import React, { useEffect, useState } from 'react';
import { Plus, GraduationCap, X, Clock, User, BarChart } from 'lucide-react';
import { mockDataEngine } from '../utils/mockDataEngine';
import type { SchoolClass, Teacher } from '../utils/mockDataEngine';

interface ClassesDashboardProps {
  role: 'admin' | 'parent';
}

export const ClassesDashboard: React.FC<ClassesDashboardProps> = ({ role }) => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('2 - 3 Years');
  const [capacity, setCapacity] = useState(20);
  const [teacherId, setTeacherId] = useState('');
  const [color, setColor] = useState<'pink' | 'yellow' | 'blue' | 'green' | 'purple'>('pink');
  const [schedule, setSchedule] = useState('09:00 AM - 01:00 PM');
  const [room, setRoom] = useState('');

  const fetchClassesData = () => {
    setClasses(mockDataEngine.getClasses());
    const allTeachers = mockDataEngine.getTeachers();
    setTeachers(allTeachers);
    if (allTeachers.length > 0) {
      setTeacherId(allTeachers[0].id);
    }
  };

  useEffect(() => {
    fetchClassesData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !room) return;

    mockDataEngine.addClass({
      name,
      ageGroup,
      capacity,
      teacherId,
      color,
      schedule,
      room
    });

    // Reset Form
    setName('');
    setRoom('');
    setCapacity(20);
    setShowModal(false);
    fetchClassesData();
  };

  const getTeacherName = (tId: string) => {
    const teacher = teachers.find(t => t.id === tId);
    return teacher ? teacher.name : 'Unassigned';
  };

  const getColorHex = (c: SchoolClass['color']) => {
    switch(c) {
      case 'pink': return '#FF6B6B';
      case 'yellow': return '#FFD93D';
      case 'blue': return '#4D96FF';
      case 'green': return '#6BCB77';
      case 'purple': return '#9B72AA';
      default: return '#FF6B6B';
    }
  };

  const getColorBg = (c: SchoolClass['color']) => {
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
      
      {/* Upper header action area */}
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
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#3D4A59' }}>Preschool Classes & Programs</h2>
          <p style={{ fontSize: '0.85rem', color: '#8E9FAA', fontWeight: '600' }}>Active courses and enrollment ratios.</p>
        </div>
        
        {role === 'admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="kid-btn btn-primary"
          >
            <Plus size={18} />
            <span>Create New Program</span>
          </button>
        )}
      </div>

      {/* Classes Card Grid */}
      <div className="kid-grid kid-grid-3">
        {classes.map((cls) => {
          const colorHex = getColorHex(cls.color);
          const colorBg = getColorBg(cls.color);
          const percentFilled = Math.round((cls.enrolled / cls.capacity) * 100);
          
          return (
            <div 
              key={cls.id} 
              className="kid-card"
              style={{
                borderTop: `8px solid ${colorHex}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '280px'
              }}
            >
              <div>
                {/* Class Badge and Name */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span 
                    className="kid-badge" 
                    style={{ backgroundColor: colorBg, color: colorHex === '#FFD93D' ? '#D4AF37' : colorHex }}
                  >
                    {cls.ageGroup}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#8E9FAA', fontWeight: '800' }}>{cls.room}</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#3D4A59', marginBottom: '16px' }}>
                  {cls.name}
                </h3>

                {/* Class Meta Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#5A6E7F', fontWeight: '600' }}>
                    <Clock size={15} style={{ color: colorHex }} />
                    <span>{cls.schedule}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#5A6E7F', fontWeight: '600' }}>
                    <User size={15} style={{ color: colorHex }} />
                    <span>Taught by: {getTeacherName(cls.teacherId)}</span>
                  </div>
                </div>
              </div>

              {/* Progress Gauge */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '800', color: '#3D4A59', marginBottom: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BarChart size={14} />
                    <span>Enrollment Capacity</span>
                  </span>
                  <span>{cls.enrolled} / {cls.capacity} kids ({percentFilled}%)</span>
                </div>
                <div 
                  style={{ 
                    width: '100%', 
                    height: '10px', 
                    backgroundColor: '#F1ECE6', 
                    borderRadius: '99px',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    style={{
                      height: '100%',
                      width: `${percentFilled}%`,
                      backgroundColor: colorHex,
                      borderRadius: '99px',
                      transition: 'width 0.8s ease'
                    }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Create Class Form Modal */}
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
                <GraduationCap color="#FF6B6B" />
                <span>Create New Program</span>
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
                <label>Program / Class Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. Playgroup Seahorses" 
                  className="kid-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Age Group</label>
                  <select 
                    value={ageGroup} 
                    onChange={e => setAgeGroup(e.target.value)}
                    className="kid-input"
                  >
                    <option value="2 - 3 Years">2 - 3 Years</option>
                    <option value="3 - 4 Years">3 - 4 Years</option>
                    <option value="4 - 5 Years">4 - 5 Years</option>
                    <option value="5 - 6 Years">5 - 6 Years</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Max Capacity</label>
                  <input 
                    type="number" 
                    value={capacity} 
                    onChange={e => setCapacity(parseInt(e.target.value))} 
                    min={5} 
                    max={40} 
                    className="kid-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Class Room</label>
                <input 
                  type="text" 
                  value={room} 
                  onChange={e => setRoom(e.target.value)} 
                  placeholder="e.g. Room E (Seashells)" 
                  className="kid-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Assigned Lead Teacher</label>
                <select 
                  value={teacherId} 
                  onChange={e => setTeacherId(e.target.value)}
                  className="kid-input"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.experience} exp)</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Timings Schedule</label>
                <input 
                  type="text" 
                  value={schedule} 
                  onChange={e => setSchedule(e.target.value)} 
                  placeholder="e.g. 09:00 AM - 01:00 PM" 
                  className="kid-input"
                  required
                />
              </div>

              {/* Theme Color Selector */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Class Card Theme Color</label>
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
                  Add Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
