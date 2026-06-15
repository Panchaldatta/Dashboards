import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardHome } from './components/DashboardHome';
import { ClassesDashboard } from './components/ClassesDashboard';
import { StudentsDashboard } from './components/StudentsDashboard';
import { TeachersDashboard } from './components/TeachersDashboard';
import { EventsDashboard } from './components/EventsDashboard';
import { ShopDashboard } from './components/ShopDashboard';
import { NoticeBoardDashboard } from './components/NoticeBoardDashboard';
import { mockDataEngine } from './utils/mockDataEngine';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [role, setRole] = useState<'admin' | 'parent'>('admin');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync role on load
  useEffect(() => {
    setRole(mockDataEngine.getCurrentRole());
  }, []);

  const handleRoleChange = (newRole: 'admin' | 'parent') => {
    setRole(newRole);
    triggerToast(`Switched view to ${newRole === 'admin' ? 'Principal Portal' : 'Parent Portal'}! 🧸`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardHome role={role} onNavigate={setCurrentView} />;
      case 'classes':
        return <ClassesDashboard role={role} />;
      case 'students':
        return <StudentsDashboard role={role} />;
      case 'teachers':
        return <TeachersDashboard onNavigateToChat={() => setCurrentView('notices')} />;
      case 'events':
        return <EventsDashboard role={role} />;
      case 'shop':
        return <ShopDashboard onShowToast={triggerToast} />;
      case 'notices':
        return <NoticeBoardDashboard role={role} />;
      default:
        return <DashboardHome role={role} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="app-container">
      {/* Background Doodles Pattern */}
      <div className="doodle-bg" />
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Panel Viewport */}
      <div className="main-content">
        <Header 
          currentView={currentView}
          role={role}
          onRoleChange={handleRoleChange}
          onShowNoticeBoard={() => setCurrentView('notices')}
        />
        
        {/* Render Selected Sub-Dashboard */}
        <main style={{ flex: 1, position: 'relative' }}>
          {renderActiveView()}
        </main>
      </div>

      {/* Playful Floating Toast Notification */}
      {toastMessage && (
        <div className="toast-notif">
          <span style={{ fontSize: '1.1rem' }}>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
