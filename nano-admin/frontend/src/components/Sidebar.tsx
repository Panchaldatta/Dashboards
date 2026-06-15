import React from 'react';
import { 
  Users, 
  TrendingUp, 
  ShoppingCart, 
  Coins, 
  BarChart3, 
  Settings, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai', label: 'AI Copilot', icon: Sparkles },
    { id: 'crm', label: 'CRM', icon: TrendingUp },
    { id: 'ecommerce', label: 'eCommerce', icon: ShoppingCart },
    { id: 'crypto', label: 'Cryptocurrency', icon: Coins },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r 
        ${isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0 lg:w-20'} 
        bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-500 text-white font-black text-lg shadow-md shadow-primary-500/10 shrink-0 select-none">
            N
          </div>
          {isOpen && (
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent font-sans">
              Nano
            </span>
          )}
        </div>

        
        {isOpen && (
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ChevronRight size={18} className="rotate-180" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10' 
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
            >
              <Icon size={20} className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-zinc-400 dark:text-zinc-500'}`} />
              {isOpen && (
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              )}
              {!isOpen && (
                <div className="absolute left-20 bg-zinc-900 text-white text-xs rounded-md px-2 py-1 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
