import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AIDashboard } from './components/AIDashboard';
import { CRMDashboard } from './components/CRMDashboard';
import { ECommerceDashboard } from './components/ECommerceDashboard';
import { CryptoDashboard } from './components/CryptoDashboard';
import { UsersDashboard } from './components/UsersDashboard';
import { SettingsDashboard } from './components/SettingsDashboard';
import { 
  X,
  Palette,
  Check
} from 'lucide-react';

type ThemePreset = 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // Default to dark mode for WowDash aesthetics
  });
  
  // Customizer Drawer State
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [themePreset, setThemePreset] = useState<ThemePreset>(() => {
    return (localStorage.getItem('theme-preset') as ThemePreset) || 'indigo';
  });

  // Dark Mode Side Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Theme Preset Side Effect
  useEffect(() => {
    const root = window.document.documentElement;
    // Remove all theme- classes
    root.classList.forEach(className => {
      if (className.startsWith('theme-')) {
        root.classList.remove(className);
      }
    });
    // Add current theme preset class
    root.classList.add(`theme-${themePreset}`);
    localStorage.setItem('theme-preset', themePreset);
  }, [themePreset]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'ai':
        return <AIDashboard />;
      case 'crm':
        return <CRMDashboard />;
      case 'ecommerce':
        return <ECommerceDashboard />;
      case 'crypto':
        return <CryptoDashboard />;
      case 'users':
        return <UsersDashboard />;
      case 'settings':
        return <SettingsDashboard />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  const colorOptions: { id: ThemePreset; color: string; label: string }[] = [
    { id: 'indigo', color: 'bg-[#4f46e5]', label: 'Indigo' },
    { id: 'emerald', color: 'bg-[#059669]', label: 'Emerald' },
    { id: 'rose', color: 'bg-[#e11d48]', label: 'Rose' },
    { id: 'amber', color: 'bg-[#d97706]', label: 'Amber' },
    { id: 'cyan', color: 'bg-[#0891b2]', label: 'Cyan' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Layout Container */}
      <div 
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}
      >
        <Header 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          toggleCustomizer={() => setIsCustomizerOpen(true)}
        />
        
        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto font-sans">
          {renderContent()}
        </main>
      </div>

      {/* Slide-out Theme Customizer Drawer */}
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-80 h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between shadow-2xl animate-slide-in">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-4">
                <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 text-sm">
                  <Palette size={18} className="text-primary-600" />
                  Theme Customizer
                </h3>
                <button 
                  onClick={() => setIsCustomizerOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-805 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Color Presets */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Accent Theme Color</span>
                <div className="grid grid-cols-5 gap-3">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setThemePreset(opt.id)}
                      className={`w-10 h-10 rounded-full ${opt.color} flex items-center justify-center text-white shadow-sm transition-transform hover:scale-105 relative`}
                      title={opt.label}
                    >
                      {themePreset === opt.id && <Check size={16} className="drop-shadow-sm font-bold" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Toggles */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Layout Style</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      isSidebarOpen 
                        ? 'border-primary-600 bg-primary-500/5 text-primary-600' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    Expanded Sidebar
                  </button>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      !isSidebarOpen 
                        ? 'border-primary-600 bg-primary-500/5 text-primary-600' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    Compact Sidebar
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCustomizerOpen(false)}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md shadow-primary-600/10 font-semibold text-xs transition-colors"
            >
              Apply Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
