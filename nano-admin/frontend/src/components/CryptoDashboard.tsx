import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  RefreshCw, 
  History,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from 'recharts';
import { getCryptoMarket, executeCryptoTrade } from '../utils/mockDataEngine';

interface Coin {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  color: string;
}

interface Transaction {
  id: string;
  type: string;
  coin: string;
  amount: number;
  total: number;
  date: string;
}

interface PriceHistoryPoint {
  time: string;
  BTC: number;
  ETH: number;
  SOL: number;
}

export const CryptoDashboard: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeCoin, setActiveCoin] = useState('BTC');
  const [loading, setLoading] = useState(true);

  // Live Chart Points State
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);

  // Trading form states
  const [tradeType, setTradeType] = useState<'Buy' | 'Sell'>('Buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeCoin, setTradeCoin] = useState('BTC');
  const [tradeSuccess, setTradeSuccess] = useState<string | null>(null);

  const fetchCryptoMarket = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const data = await getCryptoMarket();
      setCoins(data.coins);
      setTransactions(data.transactions as Transaction[]);
      
      // Update Chart History points
      const btc = data.coins.find((c: Coin) => c.symbol === 'BTC')?.price || 0;
      const eth = data.coins.find((c: Coin) => c.symbol === 'ETH')?.price || 0;
      const sol = data.coins.find((c: Coin) => c.symbol === 'SOL')?.price || 0;
      
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setPriceHistory(prev => {
        const next = [...prev, { time: timeString, BTC: btc, ETH: eth, SOL: sol }];
        if (next.length > 15) next.shift(); // Keep only last 15 ticks
        return next;
      });
    } catch (err) {
      console.error(err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };


  // Poll for simulated live prices every 3 seconds
  useEffect(() => {
    fetchCryptoMarket(true);
    const interval = setInterval(() => {
      fetchCryptoMarket(false);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeAmount || Number(tradeAmount) <= 0) return;

    try {
      const res = await executeCryptoTrade({
        type: tradeType,
        symbol: tradeCoin,
        amount: Number(tradeAmount)
      });
      setTransactions(prev => [res as Transaction, ...prev]);
      setTradeSuccess(`Trade successful: ${tradeType} ${tradeAmount} ${tradeCoin}`);
      setTradeAmount('');
      setTimeout(() => setTradeSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const getActiveCoinColor = () => {
    return coins.find(c => c.symbol === activeCoin)?.color || '#6366f1';
  };

  if (loading && coins.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Coins className="text-primary-600 dark:text-primary-400" />
            Cryptocurrency Terminal
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Live mock exchange monitor with periodic tick updating and simulated trading.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-primary-600 bg-primary-50 dark:bg-primary-950/20 px-3 py-1.5 rounded-xl font-semibold animate-pulse">
          <RefreshCw size={12} className="animate-spin" />
          <span>Polling Live Feeds</span>
        </div>
      </div>

      {/* Grid: Rates widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coins.map((coin) => {
          const isPositive = coin.change24h >= 0;
          const isActive = coin.symbol === activeCoin;
          return (
            <button
              key={coin.symbol}
              onClick={() => setActiveCoin(coin.symbol)}
              className={`p-6 text-left bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group
                ${isActive ? 'border-primary-600 dark:border-primary-500 ring-2 ring-primary-500/10' : 'border-zinc-200 dark:border-zinc-800'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{coin.name} ({coin.symbol})</span>
                <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isPositive 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' 
                    : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600'
                }`}>
                  {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {coin.change24h}%
                </span>
              </div>
              <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-4">
                ${coin.price.toLocaleString()}
              </p>
              <div 
                className="absolute bottom-0 left-0 h-1 transition-all duration-300"
                style={{ backgroundColor: coin.color, width: isActive ? '100%' : '0%' }}
              />
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart showing price history */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp size={18} className="text-primary-500" />
              Live Chart: {activeCoin} Price Action
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Periodic price ticks (3s intervals)</p>
          </div>
          
          <div className="h-72 w-full mt-6 flex-1">
            {priceHistory.length < 2 ? (
              <div className="h-full flex items-center justify-center text-zinc-400 text-xs">
                Accumulating market ticker coordinates...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200,200,200,0.1)" />
                  <XAxis dataKey="time" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={['auto', 'auto']}
                    tickFormatter={(val) => `$${val.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{ 
                      background: 'rgba(24, 24, 27, 0.95)', 
                      border: '1px solid rgba(63, 63, 70, 0.4)', 
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={activeCoin} 
                    stroke={getActiveCoinColor()} 
                    strokeWidth={2} 
                    dot={false}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Trade Executions Wallet Panel */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col justify-between h-[420px]">
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5 mb-2">
              <Wallet size={16} className="text-primary-600 dark:text-primary-400" />
              Simulate Trading Desk
            </h3>
            {tradeSuccess && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] rounded-lg">
                {tradeSuccess}
              </div>
            )}
          </div>

          <form onSubmit={handleTradeSubmit} className="space-y-4 my-4">
            <div className="flex gap-2 p-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl">
              <button
                type="button"
                onClick={() => setTradeType('Buy')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  tradeType === 'Buy' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setTradeType('Sell')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  tradeType === 'Sell' ? 'bg-rose-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                Sell
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 block mb-1">Coin</label>
                <select
                  value={tradeCoin}
                  onChange={e => setTradeCoin(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-lg focus:outline-none text-zinc-900 dark:text-white"
                >
                  <option value="BTC">Bitcoin</option>
                  <option value="ETH">Ethereum</option>
                  <option value="SOL">Solana</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 block mb-1">Amount</label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={tradeAmount}
                  onChange={e => setTradeAmount(e.target.value)}
                  placeholder="0.05"
                  required
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-lg focus:outline-none text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2 rounded-xl text-white text-xs font-bold transition-all shadow-md ${
                tradeType === 'Buy' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/10'
              }`}
            >
              Submit {tradeType} Order
            </button>
          </form>

          {/* Ledger history */}
          <div className="border-t border-zinc-100 dark:border-zinc-800/50 pt-3">
            <h4 className="text-[10px] font-bold text-zinc-400 flex items-center gap-1 mb-2">
              <History size={10} />
              Recent Fills
            </h4>
            <div className="h-28 overflow-y-auto space-y-2 pr-1 text-[10px]">
              {transactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold ${tx.type === 'Buy' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type}
                    </span>
                    <span>{tx.amount} {tx.coin}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-zinc-950 dark:text-white">${tx.total.toLocaleString()}</div>
                    <div className="text-[8px] text-zinc-400">{tx.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
