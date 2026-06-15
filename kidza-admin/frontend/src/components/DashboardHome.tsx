import React, { useEffect, useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  Smile, 
  TrendingUp, 
  Apple 
} from 'lucide-react';
import { mockDataEngine } from '../utils/mockDataEngine';
import type { Student, SchoolClass } from '../utils/mockDataEngine';

interface DashboardHomeProps {
  role: 'admin' | 'parent';
  onNavigate: (view: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ role, onNavigate }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [teachersCount, setTeachersCount] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(0);

  useEffect(() => {
    const fetchStats = () => {
      const allStudents = mockDataEngine.getStudents();
      const allClasses = mockDataEngine.getClasses();
      const allTeachers = mockDataEngine.getTeachers();

      setStudents(allStudents);
      setClasses(allClasses);
      setTeachersCount(allTeachers.length);

      // Calculate attendance rate
      if (allStudents.length > 0) {
        const present = allStudents.filter(
          s => s.attendanceStatus === 'present' || s.attendanceStatus === 'late'
        ).length;
        const rate = Math.round((present / allStudents.length) * 100);
        setAttendanceRate(rate);
      }
    };

    fetchStats();
    // Listening for updates
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Active Kids', value: students.length, icon: Users, color: '#FF6B6B', bg: '#FF6B6B15' },
    { label: 'Programs / Classes', value: classes.length, icon: GraduationCap, color: '#FFD93D', bg: '#FFD93D15' },
    { label: 'Staff Educators', value: teachersCount, icon: UserCheck, color: '#6BCB77', bg: '#6BCB7715' },
    { label: 'Today Attendance', value: `${attendanceRate}%`, icon: Smile, color: '#4D96FF', bg: '#4D96FF15' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Playful Greeting Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #FF6B6B, #FFD93D)',
          borderRadius: '24px',
          padding: '32px',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(255, 107, 107, 0.2)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <span 
            style={{ 
              backgroundColor: '#FFFFFF30', 
              padding: '6px 14px', 
              borderRadius: '99px', 
              fontSize: '0.8rem', 
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            🏫 Kidza Summer Semester 2026
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginTop: '14px', marginBottom: '8px', color: '#FFFFFF', fontFamily: "'Fredoka', sans-serif" }}>
            {role === 'admin' 
              ? "Welcome back to school, Principal! 👋"
              : "Welcome back, Datta! How is Aarav doing today? 🧸"
            }
          </h2>
          <p style={{ fontSize: '1rem', opacity: '0.95', fontWeight: '600', lineHeight: '1.5' }}>
            {role === 'admin'
              ? "Our kids are currently in their interactive classroom sessions. 8 out of 10 students checked in today. No emergency health alerts reported."
              : "Aarav is checked in! He is attending 'Nursery Little Bears' today. All homework checklists are complete."
            }
          </p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => onNavigate(role === 'admin' ? 'students' : 'notices')}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#FF6B6B',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: "'Fredoka', sans-serif",
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              {role === 'admin' ? "Log Daily Attendance" : "Check Notices"}
            </button>
            <button 
              onClick={() => onNavigate('classes')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                border: '2px solid #FFFFFF',
                padding: '8px 18px',
                borderRadius: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: "'Fredoka', sans-serif"
              }}
            >
              Browse Classes
            </button>
          </div>
        </div>
        
        {/* Playful Floating Circles */}
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', right: '10%', bottom: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
      </div>

      {/* KPI Stats Grid */}
      <div className="kid-grid kid-grid-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="kid-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px'
            }}
          >
            <div>
              <span style={{ color: '#8E9FAA', fontSize: '0.88rem', fontWeight: '700' }}>
                {stat.label}
              </span>
              <h3 style={{ fontSize: '2rem', fontWeight: '900', color: '#3D4A59', marginTop: '4px' }}>
                {stat.value}
              </h3>
            </div>
            <div 
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '18px',
                backgroundColor: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color
              }}
            >
              <stat.icon size={26} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout (Grid split) */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '24px' 
        }}
      >
        
        {/* Left Side: Daily Timeline & Menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Lunch Menu & Creative Activity Card */}
          <div className="kid-card" style={{ borderLeft: '6px solid #6BCB77' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', backgroundColor: '#6BCB7720', borderRadius: '12px', color: '#6BCB77' }}>
                <Apple size={20} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Today's Organic Lunch & Activity</h3>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div 
                style={{ 
                  flex: 1, 
                  background: '#F0FFF2', 
                  borderRadius: '16px', 
                  padding: '16px',
                  border: '1.5px solid #D6EAD8'
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6BCB77', textTransform: 'uppercase' }}>Lunch Menu</span>
                <p style={{ fontWeight: '700', color: '#3D4A59', fontSize: '0.92rem', marginTop: '4px' }}>Cheese Macaroni & Honey Glazed Baby Carrots 🧀🥕</p>
                <p style={{ fontSize: '0.75rem', color: '#8E9FAA', marginTop: '2px' }}>100% Nut-free, low-sodium dairy</p>
              </div>

              <div 
                style={{ 
                  flex: 1, 
                  background: '#F0F6FF', 
                  borderRadius: '16px', 
                  padding: '16px',
                  border: '1.5px solid #D1E3FF'
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#4D96FF', textTransform: 'uppercase' }}>Creative Activity</span>
                <p style={{ fontWeight: '700', color: '#3D4A59', fontSize: '0.92rem', marginTop: '4px' }}>Sensory Sand Molding & Nursery Rhymes Sing-Along 🎵</p>
                <p style={{ fontSize: '0.75rem', color: '#8E9FAA', marginTop: '2px' }}>Coordinated by Miss Clara Henderson</p>
              </div>
            </div>
          </div>

          {/* Today's Schedule timeline */}
          <div className="kid-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '16px' }}>Today's Class Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#FF6B6B', border: '3px solid #FFFFFF', boxShadow: '0 0 0 2px #FF6B6B' }} />
                  <div style={{ width: '2px', flex: 1, backgroundColor: '#F1ECE6', margin: '4px 0' }} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#FF6B6B' }}>09:00 AM - 10:00 AM</span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#3D4A59' }}>Phonics & Vocabulary Reading</h4>
                  <p style={{ fontSize: '0.8rem', color: '#8E9FAA' }}>Bears and Jellyfish classes joining puppet theatre.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#FFD93D', border: '3px solid #FFFFFF', boxShadow: '0 0 0 2px #FFD93D' }} />
                  <div style={{ width: '2px', flex: 1, backgroundColor: '#F1ECE6', margin: '4px 0' }} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#FFD93D-hover' }}>10:30 AM - 12:00 PM</span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#3D4A59' }}>Clay Art & Shape Building Workshop</h4>
                  <p style={{ fontSize: '0.8rem', color: '#8E9FAA' }}>Hands-on fine motor skill development.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#4D96FF', border: '3px solid #FFFFFF', boxShadow: '0 0 0 2px #4D96FF' }} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#4D96FF' }}>01:00 PM - 02:00 PM</span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#3D4A59' }}>Outdoor Sandbox & Playground Recess</h4>
                  <p style={{ fontSize: '0.8rem', color: '#8E9FAA' }}>Free play and physical sports coordination.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: Charts / School Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Enrollment Trend Interactive Chart */}
          <div className="kid-card" style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Student Growth Trend</h3>
                <span style={{ fontSize: '0.8rem', color: '#8E9FAA', fontWeight: '600' }}>Enrollments for last 5 months</span>
              </div>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#6BCB77',
                  fontSize: '0.85rem',
                  fontWeight: '800'
                }}
              >
                <TrendingUp size={16} />
                <span>+14.2%</span>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div 
              style={{ 
                height: '160px', 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'flex-end',
                position: 'relative',
                marginTop: '10px'
              }}
            >
              {/* SVG Graphic */}
              <svg viewBox="0 0 400 120" style={{ width: '100%', height: '120px' }}>
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4D96FF" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#4D96FF" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Gridlines */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="#F1ECE6" strokeWidth="1.5" strokeDasharray="5,5" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="#F1ECE6" strokeWidth="1.5" strokeDasharray="5,5" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="#F1ECE6" strokeWidth="1.5" strokeDasharray="5,5" />
                
                {/* Area path */}
                <path 
                  d="M 10 100 L 10 90 Q 100 60 100 75 Q 190 40 190 45 Q 290 5 290 20 Q 380 -5 380 10 L 380 120 L 10 120 Z" 
                  fill="url(#chart-grad)"
                />
                
                {/* Line path */}
                <path 
                  d="M 10 90 Q 100 75 190 45 Q 290 20 380 10" 
                  fill="none" 
                  stroke="#4D96FF" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                />

                {/* Dot markers */}
                <circle cx="10" cy="90" r="5" fill="#4D96FF" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="100" cy="75" r="5" fill="#4D96FF" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="190" cy="45" r="5" fill="#4D96FF" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="290" cy="20" r="5" fill="#4D96FF" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="380" cy="10" r="5" fill="#4D96FF" stroke="#FFFFFF" strokeWidth="2" />
              </svg>

              {/* Labels */}
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '0.72rem', 
                  color: '#8E9FAA', 
                  fontWeight: '700',
                  marginTop: '8px'
                }}
              >
                <span>Jan (52)</span>
                <span>Feb (60)</span>
                <span>Mar (71)</span>
                <span>Apr (82)</span>
                <span>May (96)</span>
              </div>
            </div>
          </div>

          {/* Quick Notice Widget */}
          <div className="kid-card" style={{ borderLeft: '6px solid #FFD93D' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '12px' }}>Urgent Notices</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: '#FFFDF0', border: '1.5px solid #F6E5B3', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '800', fontSize: '0.8rem', color: '#D4AF37' }}>Urgent Alert</span>
                  <span style={{ fontSize: '0.7rem', color: '#8E9FAA', fontWeight: '700' }}>June 14</span>
                </div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginTop: '6px', color: '#3D4A59' }}>Monsoon Flu Screenings Active</h4>
                <p style={{ fontSize: '0.78rem', color: '#5A6E7F', marginTop: '2px' }}>Please check temperature parameters before sending children to daycare.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
