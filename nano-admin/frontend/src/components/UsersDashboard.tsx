import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Trash2, 
  UserCheck, 
  Search
} from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser } from '../utils/mockDataEngine';

interface UserItem {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  date: string;
}

export const UsersDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New user form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User');
  const [status, setStatus] = useState('Active');
  const [showAddForm, setShowAddForm] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data as UserItem[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      const res = await createUser({
        name,
        email,
        role,
        status
      });
      setUsers(prev => [...prev, res as UserItem]);
      setName('');
      setEmail('');
      setRole('User');
      setStatus('Active');
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      const res = await updateUser(id, { role: newRole });
      setUsers(prev => prev.map(u => u.id === id ? res as UserItem : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await updateUser(id, { status: newStatus });
      setUsers(prev => prev.map(u => u.id === id ? res as UserItem : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'All' || user.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <UserCheck className="text-primary-600 dark:text-primary-400" />
            Users & Roles Management
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Configure administrative access parameters, assign role hierarchy, and monitor statuses.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md shadow-primary-600/10 transition-colors text-sm font-semibold self-start"
        >
          <UserPlus size={16} />
          <span>Add User</span>
        </button>
      </div>

      {/* Add User Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleCreateUser} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4 max-w-xl">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Register System User</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1">Role Hierarchy</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:outline-none text-zinc-900 dark:text-white"
              >
                <option value="User">Standard User</option>
                <option value="Moderator">Moderator</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:outline-none text-zinc-900 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Save User
            </button>
          </div>
        </form>
      )}

      {/* Users Table Card */}
      <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
        {/* Search Bar & Role Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-550 text-zinc-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-zinc-50/55 dark:bg-zinc-950/45 border border-zinc-200 dark:border-zinc-800/80 rounded-xl w-fit self-start md:self-auto shadow-xs">
            {['All', 'Admin', 'Moderator', 'User'].map((roleOpt) => (
              <button
                key={roleOpt}
                onClick={() => setSelectedRoleFilter(roleOpt)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  selectedRoleFilter === roleOpt
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100'
                }`}
              >
                {roleOpt === 'All' ? 'All Roles' : roleOpt}
              </button>
            ))}
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-150 dark:border-zinc-800 text-zinc-400 font-medium text-xs uppercase tracking-wider">
                <th className="pb-3 font-bold">User Metadata</th>
                <th className="pb-3 font-bold">Role</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Registration Date</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20">
                  <td className="py-3.5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-450 flex items-center justify-center font-bold text-xs uppercase">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white text-sm">{user.name}</div>
                      <div className="text-xs text-zinc-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <select
                      value={user.role}
                      onChange={e => handleUpdateRole(user.id, e.target.value)}
                      className="text-xs font-semibold px-2 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none text-zinc-900 dark:text-white"
                    >
                      <option value="User">User</option>
                      <option value="Moderator">Moderator</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3.5">
                    <select
                      value={user.status}
                      onChange={e => handleUpdateStatus(user.id, e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                        user.status === 'Active' 
                          ? 'border-emerald-250 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-600'
                          : user.status === 'Pending'
                          ? 'border-amber-250 bg-amber-50/30 dark:bg-amber-950/20 text-amber-600'
                          : 'border-rose-250 bg-rose-50/30 dark:bg-rose-950/20 text-rose-600'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="py-3.5 text-xs text-zinc-550 dark:text-zinc-500">{user.date}</td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
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
