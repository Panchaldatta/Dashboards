import React, { useEffect, useState } from 'react';
import { ShoppingBag, ShoppingCart, Plus, Minus, X, Trash2, CheckCircle } from 'lucide-react';
import { mockDataEngine } from '../utils/mockDataEngine';
import type { ShopItem, CartItem } from '../utils/mockDataEngine';

interface ShopDashboardProps {
  onShowToast: (msg: string) => void;
}

export const ShopDashboard: React.FC<ShopDashboardProps> = ({ onShowToast }) => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const fetchShopData = () => {
    setItems(mockDataEngine.getShopItems());
    setCart(mockDataEngine.getCart());
  };

  useEffect(() => {
    fetchShopData();
  }, []);

  const handleAddToCart = (itemId: string) => {
    mockDataEngine.addToCart(itemId);
    fetchShopData();
    onShowToast("Added item to Cart! 🎒");
  };

  const handleUpdateQty = (itemId: string, qty: number) => {
    mockDataEngine.updateCartQuantity(itemId, qty);
    fetchShopData();
  };

  const handleCheckout = () => {
    mockDataEngine.clearCart();
    setCart([]);
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setShowCartPanel(false);
    }, 3000);
    onShowToast("Order placed successfully! 🎉");
  };

  const getProductDetails = (itemId: string) => {
    return items.find(i => i.id === itemId);
  };

  // Calculate Cart Totals
  const getCartSubtotal = () => {
    return cart.reduce((acc, curr) => {
      const prod = getProductDetails(curr.itemId);
      return acc + (prod ? prod.price * curr.quantity : 0);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((acc, curr) => acc + curr.quantity, 0);
  };

  const filteredItems = items.filter(item => {
    return category === 'all' || item.category === category;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
      
      {/* Shop Header action bar */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#3D4A59' }}>Kidza School Store</h2>
          <p style={{ fontSize: '0.85rem', color: '#8E9FAA', fontWeight: '600' }}>Order uniforms, course books, paint sets, and preschool accessories.</p>
        </div>

        {/* View Cart Floating Trigger */}
        <button 
          onClick={() => setShowCartPanel(true)}
          className="kid-btn btn-primary"
          style={{ position: 'relative' }}
        >
          <ShoppingCart size={18} />
          <span>My Cart</span>
          {getCartItemsCount() > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#FFD93D',
                color: '#3D4A59',
                fontSize: '0.72rem',
                fontWeight: '900',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF'
              }}
            >
              {getCartItemsCount()}
            </span>
          )}
        </button>
      </div>

      {/* Category Navigation Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
        {[
          { id: 'all', label: 'All Products' },
          { id: 'uniforms', label: 'Uniforms' },
          { id: 'books', label: 'Books' },
          { id: 'kits', label: 'Art Kits' },
          { id: 'accessories', label: 'Accessories' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '14px',
              border: '2px solid #F1ECE6',
              cursor: 'pointer',
              backgroundColor: category === cat.id ? '#FF6B6B' : '#FFFFFF',
              color: category === cat.id ? '#FFFFFF' : '#8E9FAA',
              fontWeight: '800',
              fontSize: '0.88rem',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.25)',
              whiteSpace: 'nowrap'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Catalog Grid */}
      <div className="kid-grid kid-grid-3">
        {filteredItems.map((prod) => {
          return (
            <div 
              key={prod.id} 
              className="kid-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px'
              }}
            >
              <div>
                {/* Product Thumbnail */}
                <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '18px', overflow: 'hidden', marginBottom: '14px', border: '1px solid #F1ECE6' }}>
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {!prod.inStock && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(61, 74, 89, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontWeight: '800',
                        fontSize: '0.9rem'
                      }}
                    >
                      Out of Stock
                    </div>
                  )}
                  
                  {/* Category Tag */}
                  <span 
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#FF6B6B',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {prod.category}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#3D4A59', marginBottom: '6px', lineHeight: '1.3' }}>
                  {prod.name}
                </h3>
              </div>

              {/* Price & Cart Actions */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderTop: '1.5px dashed #F1ECE6', 
                  paddingTop: '12px',
                  marginTop: '12px'
                }}
              >
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#6BCB77' }}>
                  ${prod.price.toFixed(2)}
                </span>
                
                <button
                  disabled={!prod.inStock}
                  onClick={() => handleAddToCart(prod.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    backgroundColor: prod.inStock ? '#FF6B6B' : '#E5DEC9',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    cursor: prod.inStock ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.3s ease'
                  }}
                  className="add-to-cart-btn"
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Slide-out Shopping Cart Drawer */}
      {showCartPanel && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(61, 74, 89, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          {/* Main Drawer Panel */}
          <div 
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#FFFFFF',
              height: '100%',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
              animation: 'all 0.3s ease'
            }}
          >
            {/* Header */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2.5px solid #F1ECE6', paddingBottom: '16px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart color="#FF6B6B" />
                  <span>Shopping Cart</span>
                </h3>
                <button 
                  onClick={() => setShowCartPanel(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8E9FAA' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Items List scrollbox */}
              {checkoutSuccess ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '60px' }}>
                  <CheckCircle size={56} color="#6BCB77" className="animate-wiggle" />
                  <h4 style={{ fontWeight: '800', fontSize: '1.15rem' }}>Order Placed Successfully!</h4>
                  <p style={{ fontSize: '0.85rem', color: '#8E9FAA', textAlign: 'center' }}>We have received your request and will prepare the packages shortly.</p>
                </div>
              ) : cart.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '60px', color: '#8E9FAA' }}>
                  <ShoppingBag size={42} />
                  <span style={{ fontWeight: '700' }}>Your cart is empty!</span>
                  <span style={{ fontSize: '0.8rem' }}>Add textbooks or uniforms to get started.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
                  {cart.map((cartItem) => {
                    const prod = getProductDetails(cartItem.itemId);
                    if (!prod) return null;
                    
                    return (
                      <div 
                        key={cartItem.itemId}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '12px',
                          border: '2px solid #F1ECE6',
                          borderRadius: '16px'
                        }}
                      >
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#3D4A59', lineHeight: '1.2' }}>{prod.name}</h4>
                          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#6BCB77', marginTop: '2px', display: 'block' }}>
                            ${prod.price.toFixed(2)}
                          </span>
                        </div>
                        
                        {/* Quantity adjusters */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F6F2EB', borderRadius: '8px', padding: '2px' }}>
                          <button
                            onClick={() => handleUpdateQty(cartItem.itemId, cartItem.quantity - 1)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#5A6E7F' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '0.85rem', fontWeight: '800', minWidth: '16px', textAlign: 'center' }}>
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(cartItem.itemId, cartItem.quantity + 1)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#5A6E7F' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom calculation and checkout */}
            {!checkoutSuccess && cart.length > 0 && (
              <div style={{ borderTop: '2.5px solid #F1ECE6', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.1rem', color: '#3D4A59', marginBottom: '16px' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: '#6BCB77' }}>${getCartSubtotal().toFixed(2)}</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => {
                      mockDataEngine.clearCart();
                      setCart([]);
                    }}
                    style={{
                      border: '2px solid #FF6B6B',
                      backgroundColor: 'transparent',
                      color: '#FF6B6B',
                      padding: '12px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={16} />
                    <span>Clear</span>
                  </button>

                  <button
                    onClick={handleCheckout}
                    style={{
                      border: 'none',
                      backgroundColor: '#6BCB77',
                      color: '#FFFFFF',
                      padding: '12px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
