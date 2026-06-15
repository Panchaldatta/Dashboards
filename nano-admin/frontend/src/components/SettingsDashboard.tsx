import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Sliders, 
  CheckCircle,
  Save
} from 'lucide-react';
import { getSystemSettings, saveSystemSettings } from '../utils/mockDataEngine';

interface SettingsData {
  profile: {
    fullName: string;
    email: string;
    avatar: string;
    timezone: string;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
  };
  preferences: {
    maintenanceMode: boolean;
    backupInterval: string;
    logLevel: string;
  };
}

export const SettingsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Forms states mapped to API shape
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [timezone, setTimezone] = useState('');

  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [backupInterval, setBackupInterval] = useState('Daily');
  const [logLevel, setLogLevel] = useState('Info');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await getSystemSettings();
      const data = res as SettingsData;
      
      setFullName(data.profile.fullName);
      setEmail(data.profile.email);
      setAvatar(data.profile.avatar);
      setTimezone(data.profile.timezone);

      setTwoFactor(data.security.twoFactor);
      setSessionTimeout(data.security.sessionTimeout);

      setMaintenanceMode(data.preferences.maintenanceMode);
      setBackupInterval(data.preferences.backupInterval);
      setLogLevel(data.preferences.logLevel);
    } catch (err) {
      console.error(err);
    } {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await saveSystemSettings({
        profile: { fullName, email, avatar, timezone },
        security: { twoFactor, sessionTimeout: Number(sessionTimeout) },
        preferences: { maintenanceMode, backupInterval, logLevel }
      });
      if (res) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <Settings className="text-primary-600 dark:text-primary-400" />
          System Settings
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Configure administrator user profile data, system policies, and database preferences.</p>
      </div>

      {/* Success Banner */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle size={18} />
          <span className="text-sm font-semibold">Settings successfully updated and saved.</span>
        </div>
      )}

      {/* Card Wrapper */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[450px]">
        {/* Navigation Tabs (Left side) */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-805 bg-zinc-50/50 dark:bg-zinc-950/10 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all
              ${activeTab === 'profile' 
                ? 'bg-primary-600 text-white shadow-sm' 
                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-805 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
          >
            <User size={16} />
            <span>Profile Configuration</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all
              ${activeTab === 'security' 
                ? 'bg-primary-600 text-white shadow-sm' 
                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-805 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
          >
            <Shield size={16} />
            <span>Security & Policies</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all
              ${activeTab === 'preferences' 
                ? 'bg-primary-600 text-white shadow-sm' 
                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
          >
            <Sliders size={16} />
            <span>System Preferences</span>
          </button>
        </div>

        {/* Configurations Form (Right side) */}
        <form onSubmit={handleSaveSettings} className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-6 max-w-xl">
            {/* PROFILE SETTINGS */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base">Profile Setup</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-zinc-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-zinc-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-1">Avatar Image URL</label>
                    <input
                      type="text"
                      value={avatar}
                      onChange={e => setAvatar(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-zinc-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-1">Timezone Location</label>
                    <select
                      value={timezone}
                      onChange={e => setTimezone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-lg focus:outline-none text-zinc-900 dark:text-white"
                    >
                      <option value="GMT-8 (PST)">GMT-8 (PST)</option>
                      <option value="GMT-5 (EST)">GMT-5 (EST)</option>
                      <option value="GMT+0 (UTC)">GMT+0 (UTC)</option>
                      <option value="GMT+5.5 (IST)">GMT+5.5 (IST)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY SETTINGS */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base">Security Protocols</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl">
                    <div>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-white block">Two-Factor Authentication (2FA)</span>
                      <p className="text-[10px] text-zinc-400">Request mobile verification tags during session setup.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={twoFactor}
                        onChange={e => setTwoFactor(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-650 peer-checked:bg-primary-650"></div>
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-1">Inactivity Session Timeout (Minutes)</label>
                    <input
                      type="number"
                      value={sessionTimeout}
                      onChange={e => setSessionTimeout(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-zinc-900 dark:text-white"
                      min="5"
                      max="120"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PREFERENCES SETTINGS */}
            {activeTab === 'preferences' && (
              <div className="space-y-4">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base">System Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl">
                    <div>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-white block">Maintenance Lock</span>
                      <p className="text-[10px] text-zinc-400">Redirect system clients to progress dashboards.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={maintenanceMode}
                        onChange={e => setMaintenanceMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-650 peer-checked:bg-primary-650"></div>
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-1">Automatic DB Backup Interval</label>
                    <select
                      value={backupInterval}
                      onChange={e => setBackupInterval(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-lg focus:outline-none text-zinc-900 dark:text-white"
                    >
                      <option value="Daily">Daily Scheduled Ticks</option>
                      <option value="Weekly">Weekly Schedules</option>
                      <option value="Monthly">Monthly Intervals</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-1">API Logger Verbosity</label>
                    <select
                      value={logLevel}
                      onChange={e => setLogLevel(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-lg focus:outline-none text-zinc-900 dark:text-white"
                    >
                      <option value="Info">Info logs (Default)</option>
                      <option value="Debug">Full Debug trace</option>
                      <option value="Error">Only critical warnings</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Save Submit Button */}
          <div className="border-t border-zinc-100 dark:border-zinc-850 pt-4 mt-8 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md shadow-primary-600/10 font-semibold text-xs transition-all"
            >
              <Save size={16} />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
