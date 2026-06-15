import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  Menu, 
  Palette,
  Settings as SettingsIcon,
  LogOut,
  Check,
  AlertCircle
} from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleCustomizer: () => void;
}

interface NotificationItem {
  id: string;
  text: string;
  time: string;
  read: boolean;
  type: 'info' | 'alert' | 'success';
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  setActiveTab,
  darkMode,
  toggleDarkMode,
  toggleCustomizer,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', text: 'AI code optimization suggestion is ready.', time: '2 mins ago', read: false, type: 'info' },
    { id: '2', text: 'New corporate lead: Acme Corp registered.', time: '10 mins ago', read: false, type: 'success' },
    { id: '3', text: 'Market Alert: SOL spiked +5.4% in 3 seconds.', time: '1 hr ago', read: true, type: 'alert' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
      
      {/* Background click-away triggers for active dropdowns */}
      {showNotifications && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowNotifications(false)} />
      )}
      {showProfile && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowProfile(false)} />
      )}

      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
        
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-64 pl-10 pr-4 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-zinc-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 relative z-50">
        {/* Theme Customizer Icon */}
        <button
          onClick={toggleCustomizer}
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          title="Theme Customizer"
        >
          <Palette size={20} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={20} className="text-amber-500 animate-spin-slow" /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary-600 rounded-full ring-2 ring-white dark:ring-zinc-950"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-in">
              <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="font-bold text-xs text-zinc-500 uppercase tracking-wider">Recent Alerts</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleClearAll}
                    className="text-[10px] text-primary-600 dark:text-primary-450 hover:underline font-bold"
                  >
                    Clear Indicators
                  </button>
                )}
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div 
                    key={n.id}
                    onClick={(e) => handleMarkAsRead(n.id, e)}
                    className={`p-3.5 flex gap-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors relative
                      ${!n.read ? 'bg-primary-500/5' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center
                      ${n.type === 'info' ? 'bg-blue-500/10 text-blue-500' : n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      <AlertCircle size={15} />
                    </div>
                    <div className="space-y-1 pr-4">
                      <p className={`text-xs leading-relaxed ${!n.read ? 'text-zinc-900 dark:text-white font-semibold' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        {n.text}
                      </p>
                      <span className="text-[9px] text-zinc-400 block">{n.time}</span>
                    </div>
                    {!n.read && (
                      <button
                        onClick={(e) => handleMarkAsRead(n.id, e)}
                        className="absolute right-3 top-4 text-zinc-300 hover:text-zinc-700 dark:hover:text-white"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu Dropdown */}
        <div className="relative">
          <div 
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 pl-2 border-l border-zinc-200 dark:border-zinc-800 cursor-pointer select-none"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold">Alex Rivera</p>
              <p className="text-xs text-zinc-500">Super Admin</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
              alt="User avatar"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-500/20"
            />
          </div>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-in">
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
                <span className="font-semibold text-zinc-900 dark:text-white block text-sm">Alex Rivera</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">alex.rivera@nano.admin</span>
              </div>
              <div className="p-2 space-y-0.5">
                <button 
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfile(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-650 dark:text-zinc-300 hover:bg-zinc-150/40 dark:hover:bg-zinc-805 rounded-xl transition-all"
                >
                  <SettingsIcon size={14} />
                  <span>View Settings</span>
                </button>
                <button 
                  onClick={() => {
                    alert("Mock Logout Triggered. Redirecting...");
                    window.location.reload();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
