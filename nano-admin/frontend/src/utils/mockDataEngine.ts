// Centralized Mock Data Engine simulating Database operations on LocalStorage
// Built for zero-hosting portfolio deployment (Vercel, GitHub Pages)

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
};

const setStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ================= DEFAULT DATASETS =================

const defaultStats = {
  totalUsers: 14500,
  usersTrend: '+5.2%',
  totalRevenue: 543200,
  revenueTrend: '+12.5%',
  totalOrders: 1250,
  ordersTrend: '-2.4%',
  activeSessions: 890,
  sessionsTrend: '+8.1%'
};

const defaultRevenue = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
  { name: 'Jul', revenue: 7000 },
  { name: 'Aug', revenue: 8500 },
  { name: 'Sep', revenue: 7500 },
  { name: 'Oct', revenue: 9000 },
  { name: 'Nov', revenue: 8000 },
  { name: 'Dec', revenue: 10000 },
];

const defaultUsers = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', role: 'Admin', date: '2025-08-10' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', status: 'Inactive', role: 'User', date: '2025-08-11' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', status: 'Active', role: 'Moderator', date: '2025-08-12' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', status: 'Active', role: 'User', date: '2025-08-13' },
  { id: '5', name: 'Evan Wright', email: 'evan@example.com', status: 'Pending', role: 'User', date: '2025-08-14' },
];

const defaultLeads = [
  { id: '1', name: 'Acme Corp', contact: 'John Doe', value: 12000, stage: 'discovered', email: 'john@acme.com', date: '2025-08-10' },
  { id: '2', name: 'Globex Corp', contact: 'Alice Vance', value: 34000, stage: 'proposal', email: 'alice@globex.com', date: '2025-08-12' },
  { id: '3', name: 'Initech Inc', contact: 'Peter Gibbons', value: 8500, stage: 'negotiating', email: 'peter@initech.com', date: '2025-08-13' },
  { id: '4', name: 'Umbrella Co', contact: 'Albert Wesker', value: 75000, stage: 'won', email: 'wesker@umbrella.com', date: '2025-08-14' },
];

const defaultProducts = [
  { id: '1', name: 'Premium Mechanical Keyboard', price: 189, stock: 45, image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=256&auto=format&fit=crop', category: 'Accessories' },
  { id: '2', name: 'Ultra-Wide Gaming Monitor 34"', price: 499, stock: 12, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=256&auto=format&fit=crop', category: 'Monitors' },
  { id: '3', name: 'Ergonomic Mesh Office Chair', price: 299, stock: 20, image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?q=80&w=256&auto=format&fit=crop', category: 'Furniture' },
  { id: '4', name: 'Wireless Noise Cancelling Headphones', price: 249, stock: 35, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=256&auto=format&fit=crop', category: 'Audio' },
];

const defaultOrders = [
  { id: 'ORD-8941', user: 'Diana Prince', product: 'Premium Mechanical Keyboard', total: 189, date: '2025-08-14', status: 'Delivered' },
  { id: 'ORD-7729', user: 'Evan Wright', product: 'Wireless Noise Cancelling Headphones', total: 249, date: '2025-08-14', status: 'Processing' },
];

const defaultCoins = [
  { name: 'Bitcoin', symbol: 'BTC', price: 64250, change24h: 2.4, color: '#f59e0b' },
  { name: 'Ethereum', symbol: 'ETH', price: 3450, change24h: -1.2, color: '#6366f1' },
  { name: 'Solana', symbol: 'SOL', price: 145, change24h: 8.7, color: '#06b6d4' },
];

const defaultTransactions = [
  { id: 'tx-101', type: 'Buy', coin: 'BTC', amount: 0.05, total: 3212.5, date: '2025-08-14 14:22' },
  { id: 'tx-102', type: 'Sell', coin: 'ETH', amount: 1.2, total: 4140, date: '2025-08-14 15:45' },
];

const defaultSettings = {
  profile: {
    fullName: 'Alex Rivera',
    email: 'alex.rivera@nano.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    timezone: 'GMT-5 (EST)'
  },
  security: {
    twoFactor: false,
    sessionTimeout: 30
  },
  preferences: {
    maintenanceMode: false,
    backupInterval: 'Daily',
    logLevel: 'Info'
  }
};

// ================= SIMULATED API ACTIONS =================

export const getDashboardStats = async () => {
  await delay(300);
  return getStorage('nano_stats', defaultStats);
};

export const getRevenueData = async () => {
  await delay(200);
  return getStorage('nano_revenue', defaultRevenue);
};

// Users & Roles CRUD
export const getUsers = async () => {
  await delay(300);
  return getStorage('nano_users', defaultUsers);
};

export const createUser = async (userData: { name: string; email: string; role: string; status: string }) => {
  await delay(400);
  const users = getStorage('nano_users', defaultUsers);
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    date: new Date().toISOString().split('T')[0]
  };
  const updated = [...users, newUser];
  setStorage('nano_users', updated);
  
  // Increment total stats
  const stats = getStorage('nano_stats', defaultStats);
  stats.totalUsers += 1;
  setStorage('nano_stats', stats);

  return newUser;
};

export const updateUser = async (id: string, updates: Record<string, any>) => {
  await delay(300);
  const users = getStorage('nano_users', defaultUsers);
  const updated = users.map(u => {
    if (u.id === id) {
      return { ...u, ...updates };
    }
    return u;
  });
  setStorage('nano_users', updated);
  return updated.find(u => u.id === id);
};

export const deleteUser = async (id: string) => {
  await delay(300);
  const users = getStorage('nano_users', defaultUsers);
  const updated = users.filter(u => u.id !== id);
  setStorage('nano_users', updated);
  
  // Decrement total stats
  const stats = getStorage('nano_stats', defaultStats);
  stats.totalUsers = Math.max(0, stats.totalUsers - 1);
  setStorage('nano_stats', stats);

  return { success: true };
};

// CRM CRUD
export const getCRMLeads = async () => {
  await delay(300);
  return getStorage('nano_leads', defaultLeads);
};

export const createCRMLead = async (leadData: { name: string; contact: string; value: number; email: string; stage: string }) => {
  await delay(400);
  const leads = getStorage('nano_leads', defaultLeads);
  const newLead = {
    id: Date.now().toString(),
    ...leadData,
    date: new Date().toISOString().split('T')[0]
  };
  setStorage('nano_leads', [...leads, newLead]);
  return newLead;
};

export const updateCRMLead = async (id: string, updates: Record<string, any>) => {
  await delay(300);
  const leads = getStorage('nano_leads', defaultLeads);
  const updated = leads.map(l => {
    if (l.id === id) {
      return { ...l, ...updates };
    }
    return l;
  });
  setStorage('nano_leads', updated);
  return updated.find(l => l.id === id);
};

export const deleteCRMLead = async (id: string) => {
  await delay(300);
  const leads = getStorage('nano_leads', defaultLeads);
  const updated = leads.filter(l => l.id !== id);
  setStorage('nano_leads', updated);
  return { success: true };
};

// eCommerce Operations
export const getProducts = async () => {
  await delay(200);
  return getStorage('nano_products', defaultProducts);
};

export const getOrders = async () => {
  await delay(200);
  return getStorage('nano_orders', defaultOrders);
};

export const buyProduct = async (productId: string, buyerName: string) => {
  await delay(500);
  const products = getStorage('nano_products', defaultProducts);
  const orders = getStorage('nano_orders', defaultOrders);
  
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex === -1 || products[productIndex].stock <= 0) {
    throw new Error('Out of stock or invalid item');
  }

  // Decrement stock
  products[productIndex].stock -= 1;
  setStorage('nano_products', products);

  // Stats updates
  const stats = getStorage('nano_stats', defaultStats);
  stats.totalOrders += 1;
  stats.totalRevenue += products[productIndex].price;
  setStorage('nano_stats', stats);

  // Add order log
  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    user: buyerName,
    product: products[productIndex].name,
    total: products[productIndex].price,
    date: new Date().toISOString().split('T')[0],
    status: 'Processing'
  };

  const updatedOrders = [newOrder, ...orders];
  setStorage('nano_orders', updatedOrders);

  return { success: true, order: newOrder, product: products[productIndex] };
};

// Cryptocurrency
export const getCryptoMarket = async () => {
  const coins = getStorage('nano_coins', defaultCoins);
  const transactions = getStorage('nexus_crypto_txs', defaultTransactions);

  // Fluctuating rates simulation
  const fluctuatedCoins = coins.map(coin => {
    const change = (Math.random() - 0.5) * (coin.price * 0.01);
    const newPrice = Math.round((coin.price + change) * 100) / 100;
    const change24h = Math.round((coin.change24h + (Math.random() - 0.5) * 0.5) * 100) / 100;
    return { ...coin, price: newPrice, change24h };
  });
  setStorage('nano_coins', fluctuatedCoins);

  return { coins: fluctuatedCoins, transactions };
};

export const executeCryptoTrade = async (tradeData: { type: 'Buy' | 'Sell'; symbol: string; amount: number }) => {
  await delay(400);
  const coins = getStorage('nano_coins', defaultCoins);
  const transactions = getStorage('nano_crypto_txs', defaultTransactions);

  const coin = coins.find(c => c.symbol === tradeData.symbol);
  if (!coin) throw new Error('Symbol not found');

  const total = Math.round((coin.price * tradeData.amount) * 100) / 100;
  const newTx = {
    id: `tx-${Date.now().toString().slice(-4)}`,
    type: tradeData.type,
    coin: tradeData.symbol,
    amount: tradeData.amount,
    total,
    date: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };

  const updatedTxs = [newTx, ...transactions];
  setStorage('nano_crypto_txs', updatedTxs);

  return newTx;
};

// System Settings
export const getSystemSettings = async () => {
  await delay(200);
  return getStorage('nano_settings', defaultSettings);
};

export const saveSystemSettings = async (updates: any) => {
  await delay(500);
  const settings = getStorage('nano_settings', defaultSettings);
  const updated = {
    profile: { ...settings.profile, ...updates.profile },
    security: { ...settings.security, ...updates.security },
    preferences: { ...settings.preferences, ...updates.preferences }
  };
  setStorage('nano_settings', updated);
  return updated;
};

// AI Suggestion Simulation
export const getAISuggestion = async (prompt: string, type: 'chat' | 'code') => {
  await delay(600);
  let message = '';
  let code = '';

  if (type === 'code') {
    message = `Here is an optimized version of your function based on the analysis. I have reduced time complexity to O(N) by utilizing a Hash Map approach:`;
    code = `// Optimized implementation
function findDuplicates(items) {
  const seen = new Set();
  const duplicates = [];
  
  for (const item of items) {
    if (seen.has(item)) {
      duplicates.push(item);
    } else {
      seen.add(item);
    }
  }
  return duplicates;
}`;
  } else {
    message = `I processed your prompt ("${prompt}"). Here is a detailed recommendation:\n\n1. Establish clear visual guidelines utilizing shadcn/ui components.\n2. Keep interface micro-interactions under 200ms.\n3. Implement a solid state hydration routine to sync theme customizers instantly across local containers.`;
  }

  return {
    message,
    code,
    timestamp: new Date().toLocaleTimeString()
  };
};
