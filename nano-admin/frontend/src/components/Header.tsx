import React from 'react';
import { Sun, Moon, Bell, Search, Menu, Palette } from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleCustomizer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  darkMode,
  toggleDarkMode,
  toggleCustomizer,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
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

      <div className="flex items-center gap-4">
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
        <button
          className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
          aria-label="View notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full ring-2 ring-white dark:ring-zinc-950"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-2 border-l border-zinc-200 dark:border-zinc-800">
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
      </div>
    </header>
  );
};
