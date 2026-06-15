import React, { useEffect, useState } from 'react';
import { Plus, X, Search, AlertCircle, Phone, User, BookOpen, Trash2 } from 'lucide-react';
import { mockDataEngine } from '../utils/mockDataEngine';
import type { Student, SchoolClass } from '../utils/mockDataEngine';

interface StudentsDashboardProps {
  role: 'admin' | 'parent';
}

export const StudentsDashboard: React.FC<StudentsDashboardProps> = ({ role }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  
  // Enroll Form Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');
  const [age, setAge] = useState(3);
  const [gender, setGender] = useState<'boy' | 'girl'>('boy');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [healthNotes, setHealthNotes] = useState('');
  const [feesPaid, setFeesPaid] = useState(true);

  const fetchStudentsData = () => {
    setStudents(mockDataEngine.getStudents());
    const allClasses = mockDataEngine.getClasses();
    setClasses(allClasses);
    if (allClasses.length > 0) {
      setClassId(allClasses[0].id);
    }
  };

  useEffect(() => {
    fetchStudentsData();
  }, []);

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !parentName || !parentPhone) return;

    // Pick a default avatar based on gender
    const boyAvatars = [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=150',
      'https://images.unsplash.com/photo-1602052786794-70642a0b3967?w=150',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=150'
    ];
    const girlAvatars = [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=150',
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=150',
      'https://images.unsplash.com/photo-1563530669-865a7f726a45?w=150'
    ];
    const pool = gender === 'boy' ? boyAvatars : girlAvatars;
    const avatar = pool[Math.floor(Math.random() * pool.length)];

    mockDataEngine.enrollStudent({
      name,
      classId,
      age,
      gender,
      parentName,
      parentPhone,
      avatar,
      healthNotes: healthNotes || undefined,
      feesPaid
    });

    // Reset Form
    setName('');
    setParentName('');
    setParentPhone('');
    setHealthNotes('');
    setShowModal(false);
    fetchStudentsData();
  };

  const handleDelete = (sId: string) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      mockDataEngine.deleteStudent(sId);
      fetchStudentsData();
    }
  };

  const handleAttendanceChange = (studentId: string, status: Student['attendanceStatus']) => {
    mockDataEngine.toggleAttendance(studentId, status);
    fetchStudentsData();
  };

  const getClassName = (cId: string) => {
    const cls = classes.find(c => c.id === cId);
    return cls ? cls.name : 'Unknown Class';
  };

  // Filter students based on queries
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || 
                          student.parentName.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top action block */}
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
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#3D4A59' }}>Student Register & Profiles</h2>
          <p style={{ fontSize: '0.85rem', color: '#8E9FAA', fontWeight: '600' }}>Manage preschool enrollment, fees status, and daily check-ins.</p>
        </div>

        {role === 'admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="kid-btn btn-primary"
          >
            <Plus size={18} />
            <span>Enroll New Kid</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div 
        className="kid-card"
        style={{ 
          display: 'flex', 
          gap: '16px', 
          alignItems: 'center', 
          padding: '16px 20px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#8E9FAA' 
            }} 
          />
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student or parent name..."
            className="kid-input"
            style={{ paddingLeft: '42px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '200px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#3D4A59', whiteSpace: 'nowrap' }}>Class Filter:</span>
          <select 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
            className="kid-input"
          >
            <option value="all">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Card Grid */}
      <div className="kid-grid kid-grid-3">
        {filteredStudents.map((student) => {
          return (
            <div 
              key={student.id} 
              className="kid-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px'
              }}
            >
              <div>
                {/* Profile Header */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <img 
                    src={student.avatar} 
                    alt={student.name} 
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '18px',
                      border: '3px solid #F1ECE6',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#3D4A59' }}>{student.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: '#8E9FAA', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={12} />
                      {getClassName(student.classId)}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#8E9FAA', fontWeight: '700' }}>
                      Age: {student.age} yrs • {student.gender === 'boy' ? 'Boy 👦' : 'Girl 👧'}
                    </span>
                  </div>
                </div>

                {/* Health Alert Alert if any */}
                {student.healthNotes && (
                  <div 
                    style={{ 
                      backgroundColor: '#FFF0F0', 
                      border: '1px solid #FFCDCD', 
                      borderRadius: '12px', 
                      padding: '10px 12px',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      fontSize: '0.78rem',
                      color: '#FF6B6B',
                      fontWeight: '700',
                      marginBottom: '14px'
                    }}
                  >
                    <AlertCircle size={15} style={{ flexShrink: 0 }} />
                    <span>{student.healthNotes}</span>
                  </div>
                )}

                {/* Parent contact info */}
                <div 
                  style={{ 
                    borderTop: '1.5px dashed #F1ECE6', 
                    paddingTop: '12px', 
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: '#8E9FAA', fontWeight: '700' }}>Parent / Guardian:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#3D4A59', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={13} color="#8E9FAA" />
                    {student.parentName}
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#3D4A59', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={13} color="#8E9FAA" />
                    {student.parentPhone}
                  </span>
                </div>
              </div>

              {/* Bottom: Attendance Picker & Fees Info */}
              <div 
                style={{ 
                  borderTop: '1.5px solid #F1ECE6', 
                  paddingTop: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                
                {/* Attendance Toggler */}
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#8E9FAA', fontWeight: '800', display: 'block', marginBottom: '6px' }}>
                    Today's Attendance Status
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {(['present', 'late', 'absent'] as const).map((status) => {
                      const active = student.attendanceStatus === status;
                      const getTheme = () => {
                        if (status === 'present') return { color: '#6BCB77', bg: '#F0FFF2' };
                        if (status === 'late') return { color: '#FFD93D', bg: '#FFFDF0' };
                        return { color: '#FF6B6B', bg: '#FFF0F0' };
                      };
                      const theme = getTheme();
                      
                      return (
                        <button
                          key={status}
                          disabled={role !== 'admin'}
                          onClick={() => handleAttendanceChange(student.id, status)}
                          style={{
                            padding: '6px 4px',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            textTransform: 'capitalize',
                            cursor: role === 'admin' ? 'pointer' : 'default',
                            border: active ? `2px solid ${theme.color}` : '2px solid transparent',
                            backgroundColor: active ? theme.bg : '#F6F2EB',
                            color: active ? (theme.color === '#FFD93D' ? '#D4AF37' : theme.color) : '#8E9FAA',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fees Badge & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span 
                    className={`kid-badge ${student.feesPaid ? 'badge-green' : 'badge-pink'}`}
                  >
                    Fees: {student.feesPaid ? 'Paid ✓' : 'Unpaid ⚠'}
                  </span>
                  
                  {role === 'admin' && (
                    <button 
                      onClick={() => handleDelete(student.id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: '#8E9FAA',
                        padding: '4px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}
                      className="trash-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Enroll Form Modal */}
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
                <Plus color="#FF6B6B" />
                <span>Enroll New Student</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8E9FAA' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEnroll}>
              <div className="form-group">
                <label>Student's Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. Aarav Panchal" 
                  className="kid-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Age (Years)</label>
                  <input 
                    type="number" 
                    value={age} 
                    onChange={e => setAge(parseInt(e.target.value))} 
                    min={1} 
                    max={7} 
                    className="kid-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Gender</label>
                  <select 
                    value={gender} 
                    onChange={e => setGender(e.target.value as 'boy' | 'girl')}
                    className="kid-input"
                  >
                    <option value="boy">Boy</option>
                    <option value="girl">Girl</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Assigned Program / Class</label>
                <select 
                  value={classId} 
                  onChange={e => setClassId(e.target.value)}
                  className="kid-input"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Parent / Guardian Name</label>
                  <input 
                    type="text" 
                    value={parentName} 
                    onChange={e => setParentName(e.target.value)} 
                    placeholder="e.g. Datta Panchal" 
                    className="kid-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Fees Payment Status</label>
                  <select 
                    value={feesPaid ? 'paid' : 'unpaid'} 
                    onChange={e => setFeesPaid(e.target.value === 'paid')}
                    className="kid-input"
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Parent Contact Phone Number</label>
                <input 
                  type="text" 
                  value={parentPhone} 
                  onChange={e => setParentPhone(e.target.value)} 
                  placeholder="e.g. +91 98765 43210" 
                  className="kid-input"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Medical Alerts / Diet Restrictions (Optional)</label>
                <input 
                  type="text" 
                  value={healthNotes} 
                  onChange={e => setHealthNotes(e.target.value)} 
                  placeholder="e.g. Allergic to peanuts, asthmatic" 
                  className="kid-input"
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
                  Enroll Child
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
