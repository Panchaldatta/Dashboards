import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  CheckCircle,
  Truck
} from 'lucide-react';
import { getProducts, getOrders, buyProduct } from '../utils/mockDataEngine';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}

interface Order {
  id: string;
  user: string;
  product: string;
  total: number;
  date: string;
  status: string;
}

export const ECommerceDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, ordersData] = await Promise.all([
        getProducts(),
        getOrders()
      ]);
      setProducts(productsData as Product[]);
      setOrders(ordersData as Order[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const handleBuyProduct = async (productId: string) => {
    try {
      const res = await buyProduct(productId, 'Alex Rivera');
      if (res.success) {
        // Hydrate products & orders lists
        setProducts(prev => prev.map(p => p.id === productId ? res.product as Product : p));
        setOrders(prev => [res.order as Order, ...prev]);
        
        setPurchaseSuccess(`Successfully purchased: ${res.product.name}`);
        setTimeout(() => setPurchaseSuccess(null), 3000);
      }
    } catch (err) {
      console.error(err);
      alert('Order failed. Check product stock levels.');
    }
  };

  if (loading && products.length === 0) {
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
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">eCommerce Hub</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage digital inventory, track order fulfillments, and process instant mock purchases.</p>
      </div>

      {/* Success Banner */}
      {purchaseSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle size={18} />
          <span className="text-sm font-semibold">{purchaseSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Catalog List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-base text-zinc-900 dark:text-white">Product Catalog</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="relative h-44 bg-zinc-100 dark:bg-zinc-950">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-zinc-900/80 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    {product.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{product.name}</h4>
                    <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Layers size={12} />
                        Stock: {product.stock} left
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
                    <span className="text-base font-bold text-zinc-900 dark:text-white">${product.price}</span>
                    <button
                      onClick={() => handleBuyProduct(product.id)}
                      disabled={product.stock <= 0}
                      className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 text-white disabled:text-zinc-400 rounded-xl text-xs font-semibold shadow-md shadow-primary-600/10 hover:shadow-none transition-all"
                    >
                      {product.stock <= 0 ? 'Out of Stock' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order History */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col justify-between h-[550px] overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="text-primary-600 dark:text-primary-400" size={18} />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Order Fulfilment Log</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {orders.map((order) => (
              <div key={order.id} className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 rounded-xl space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">{order.id}</span>
                  <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    order.status === 'Delivered' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' 
                      : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 animate-pulse'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{order.product}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Purchased by: {order.user}</p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-dashed border-zinc-200 dark:border-zinc-800/40 text-[10px] text-zinc-400">
                  <span>{order.date}</span>
                  <span className="font-bold text-zinc-900 dark:text-white">${order.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
