import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  Briefcase, 
  Mail, 
  DollarSign, 
  UserPlus,
  Target
} from 'lucide-react';
import { getCRMLeads, createCRMLead, updateCRMLead, deleteCRMLead } from '../utils/mockDataEngine';

interface Lead {
  id: string;
  name: string;
  contact: string;
  value: number;
  stage: 'discovered' | 'proposal' | 'negotiating' | 'won';
  email: string;
  date: string;
}

const STAGES = [
  { id: 'discovered', label: 'Discovered', color: 'border-t-blue-500 bg-blue-500/5' },
  { id: 'proposal', label: 'Proposal Sent', color: 'border-t-amber-500 bg-amber-500/5' },
  { id: 'negotiating', label: 'Negotiating', color: 'border-t-purple-500 bg-purple-500/5' },
  { id: 'won', label: 'Deal Won 🎉', color: 'border-t-emerald-500 bg-emerald-500/5' },
] as const;

export const CRMDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // New Lead Form States
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [value, setValue] = useState('');
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<'discovered' | 'proposal' | 'negotiating' | 'won'>('discovered');
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await getCRMLeads();
      setLeads(data as Lead[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await createCRMLead({
        name,
        contact,
        value: Number(value) || 0,
        email,
        stage
      });
      setLeads(prev => [...prev, res as Lead]);
      setName('');
      setContact('');
      setValue('');
      setEmail('');
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveStage = async (id: string, currentStage: string) => {
    const stageFlow: Record<string, 'discovered' | 'proposal' | 'negotiating' | 'won'> = {
      discovered: 'proposal',
      proposal: 'negotiating',
      negotiating: 'won',
      won: 'discovered'
    };

    const nextStage = stageFlow[currentStage];
    try {
      const res = await updateCRMLead(id, { stage: nextStage });
      setLeads(prev => prev.map(lead => lead.id === id ? res as Lead : lead));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteCRMLead(id);
      setLeads(prev => prev.filter(lead => lead.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Summary Metrics
  const totalValue = leads.reduce((acc, lead) => acc + lead.value, 0);
  const wonDealsValue = leads.filter(l => l.stage === 'won').reduce((acc, l) => acc + l.value, 0);
  const conversionRate = leads.length ? Math.round((leads.filter(l => l.stage === 'won').length / leads.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">CRM Lead Pipeline</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Track corporate leads, assign proposals, and manage customer acquisition funnels.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md shadow-primary-600/10 transition-colors text-sm font-semibold"
        >
          <Plus size={16} />
          <span>New Lead</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-xs text-zinc-500">Pipeline Value</span>
            <p className="text-xl font-bold">${totalValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
            <Target size={20} />
          </div>
          <div>
            <span className="text-xs text-zinc-500">Closed Sales</span>
            <p className="text-xl font-bold">${wonDealsValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400">
            <UserPlus size={20} />
          </div>
          <div>
            <span className="text-xs text-zinc-500">Win Rate</span>
            <p className="text-xl font-bold">{conversionRate}%</p>
          </div>
        </div>
      </div>

      {/* Add Lead Form */}
      {showAddForm && (
        <form onSubmit={handleAddLead} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4 max-w-xl">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Create New Corporate Lead</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1">Company Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Acme Corp"
                required
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1">Contact Name</label>
              <input
                type="text"
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1">Value ($)</label>
              <input
                type="number"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="15000"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-zinc-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500 block mb-1">Initial Stage</label>
            <select
              value={stage}
              onChange={e => setStage(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-zinc-900 dark:text-white"
            >
              <option value="discovered">Discovered</option>
              <option value="proposal">Proposal</option>
              <option value="negotiating">Negotiating</option>
              <option value="won">Won</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold"
            >
              Save Lead
            </button>
          </div>
        </form>
      )}

      {/* Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STAGES.map((col) => {
          const stageLeads = leads.filter(l => l.stage === col.id);
          return (
            <div key={col.id} className="flex flex-col bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 h-[500px]">
              {/* Stage Header */}
              <div className={`border-t-4 ${col.color} pt-2.5 pb-4 flex items-center justify-between`}>
                <span className="font-bold text-sm text-zinc-900 dark:text-white">{col.label}</span>
                <span className="text-xs bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full font-semibold">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {stageLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm relative group hover:border-primary-500/40 transition-all"
                  >
                    {/* Trash delete */}
                    <button 
                      onClick={() => handleDeleteLead(lead.id)}
                      className="absolute top-3 right-3 text-zinc-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md"
                    >
                      <Trash2 size={14} />
                    </button>

                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm pr-6 truncate">{lead.name}</h4>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-1">
                      <Briefcase size={10} />
                      {lead.contact}
                    </span>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Mail size={10} />
                      {lead.email}
                    </span>

                    <div className="mt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50 pt-3">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">${lead.value.toLocaleString()}</span>
                      
                      {/* Advance Stage button */}
                      <button
                        onClick={() => handleMoveStage(lead.id, lead.stage)}
                        className="flex items-center gap-0.5 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold transition-colors"
                        title="Move to next stage"
                      >
                        <span>Move</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
