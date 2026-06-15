import React, { useEffect, useState } from 'react';
import { 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { getDashboardStats, getRevenueData, getUsers } from '../utils/mockDataEngine';

interface Stats {
  totalUsers: number;
  usersTrend: string;
  totalRevenue: number;
  revenueTrend: string;
  totalOrders: number;
  ordersTrend: string;
  activeSessions: number;
  sessionsTrend: string;
}

interface RevenueItem {
  name: string;
  revenue: number;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  date: string;
}

export const AnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, revenueData, usersData] = await Promise.all([
          getDashboardStats(),
          getRevenueData(),
          getUsers()
        ]);
        setStats(statsData);
        setRevenueData(revenueData);
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary-600/20 animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
          <Activity size={32} />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Connection Failed</h3>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-xl shadow-md shadow-primary-600/10 hover:bg-primary-700 transition-all text-sm font-medium"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers.toLocaleString() || '0',
      trend: stats?.usersTrend || '0%',
      isPositive: stats?.usersTrend.startsWith('+'),
      icon: Users,
      gradient: 'from-primary-500/10 to-primary-500/10 text-primary-600 dark:text-primary-400'
    },
    {
      title: 'Total Revenue',
      value: stats ? `$${stats.totalRevenue.toLocaleString()}` : '$0',
      trend: stats?.revenueTrend || '0%',
      isPositive: stats?.revenueTrend.startsWith('+'),
      icon: DollarSign,
      gradient: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders.toLocaleString() || '0',
      trend: stats?.ordersTrend || '0%',
      isPositive: stats?.ordersTrend.startsWith('+'),
      icon: ShoppingBag,
      gradient: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400'
    },
    {
      title: 'Active Sessions',
      value: stats?.activeSessions.toLocaleString() || '0',
      trend: stats?.sessionsTrend || '0%',
      isPositive: stats?.sessionsTrend.startsWith('+'),
      icon: Activity,
      gradient: 'from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Analytics Overview</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Welcome back! Here's what's happening with your platform today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{card.title}</span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${card.gradient}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{card.value}</span>
                <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                  card.isPositive 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' 
                    : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600'
                }`}>
                  {card.isPositive ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
                  {card.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Area Chart */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white">Revenue Growth</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Monthly revenue trends for the current year</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 font-semibold px-2.5 py-1 rounded-lg">
              <TrendingUp size={14} />
              <span>Up by 15.4%</span>
            </div>
          </div>
          <div className="h-80 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-600)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary-600)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200,200,200,0.15)" />
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(24, 24, 27, 0.95)',
                    border: '1px solid rgba(63, 63, 70, 0.4)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                  itemStyle={{ color: 'var(--primary-500)' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary-600)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut chart widget */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white">Active Traffic</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Traffic distribution by platform type</p>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Desktop', value: 45 },
                    { name: 'Mobile', value: 35 },
                    { name: 'Tablet', value: 20 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="var(--primary-600)" />
                  <Cell fill="#06b6d4" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(24, 24, 27, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">100%</span>
              <p className="text-[10px] text-zinc-400">Total Visits</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="w-2.5 h-2.5 rounded-full bg-primary-600 inline-block mr-1"></div>
              <span className="text-zinc-500">Desktop</span>
              <p className="font-bold mt-0.5">45%</p>
            </div>
            <div>
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block mr-1"></div>
              <span className="text-zinc-500">Mobile</span>
              <p className="font-bold mt-0.5">35%</p>
            </div>
            <div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mr-1"></div>
              <span className="text-zinc-500">Tablet</span>
              <p className="font-bold mt-0.5">20%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users / Table Section */}
      <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white">Recent Registrations</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Monitor newly registered user roles and status</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-medium">
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {users.slice(0, 5).map((user) => (
                <tr key={user.id} className="text-zinc-700 dark:text-zinc-300">
                  <td className="py-4">
                    <div className="font-semibold text-zinc-900 dark:text-white">{user.name}</div>
                    <div className="text-xs text-zinc-400">{user.email}</div>
                  </td>
                  <td className="py-4">{user.role}</td>
                  <td className="py-4 text-xs text-zinc-500">{user.date}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                      user.status === 'Active' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600'
                        : user.status === 'Inactive'
                        ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600'
                        : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
