import React from 'react';

export default function CartDrawer({ isOpen, onClose, items, onRemove, onCheckout }) {
  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <>
      {/* Backdrop: Dims the background and blurs the 3D stage */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh',
          background: 'rgba(0,0,0,0.3)', 
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 100, 
          display: isOpen ? 'block' : 'none', 
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }} 
      />

      {/* Drawer Panel */}
      <div style={{
        position: 'fixed', 
        top: 0, 
        right: 0, 
        height: '100vh',
        width: '100%', 
        maxWidth: '400px', 
        background: '#fff',
        zIndex: 101, 
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', 
        flexDirection: 'column', 
        boxShadow: '-10px 0 30px rgba(0,0,0,0.05)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        
        {/* Header */}
        <div style={{ 
          padding: '30px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid #eee' 
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#000', letterSpacing: '-0.5px' }}>
            YOUR CART ({items.length})
          </h2>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '28px', 
              cursor: 'pointer', 
              color: '#000',
              lineHeight: 1 
            }}
          >
            ×
          </button>
        </div>

        {/* List of Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', scrollbarWidth: 'none' }}>
          {items.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '60px', 
              color: '#999', 
              fontSize: '14px',
              fontWeight: '500' 
            }}>
              Your cart is currently empty.
            </div>
          ) : (
            items.map(item => (
              <div key={item.cartId} style={{ 
                display: 'flex', 
                gap: '16px', 
                marginBottom: '24px', 
                alignItems: 'center',
                animation: 'fadeIn 0.3s ease-out'
              }}>
                {/* Product Thumbnail */}
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: '#f9f9f9', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '1px solid #f0f0f0' 
                }}>
                  <img src={item.imageUrl} style={{ width: '80%', height: '80%', objectFit: 'contain' }} alt={item.id} />
                </div>

                {/* Product Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#000', textTransform: 'uppercase' }}>
                    {item.id.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '4px', fontWeight: '500' }}>
                    {item.config.material} • {item.config.layout}
                  </div>
                  <div style={{ fontWeight: '800', marginTop: '8px', fontSize: '15px', color: '#000' }}>
                    ${item.price}
                  </div>
                </div>

                {/* Remove Action */}
                <button 
                  onClick={() => onRemove(item.cartId)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#ff4444', 
                    fontSize: '11px', 
                    fontWeight: '700', 
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        <div style={{ 
          padding: '24px', 
          borderTop: '1px solid #eee', 
          background: '#fff',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.02)' 
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '20px',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: '700', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Subtotal</span>
            <span style={{ fontWeight: '900', fontSize: '22px', color: '#000' }}>${totalPrice}</span>
          </div>

          <button 
            onClick={() => {
              onClose(); 
              onCheckout(); 
            }}
            disabled={items.length === 0}
            style={{
              width: '100%', 
              background: items.length === 0 ? '#ccc' : '#000', 
              color: '#fff', 
              border: 'none', 
              padding: '20px', 
              borderRadius: '14px', 
              fontWeight: '800', 
              fontSize: '15px', 
              cursor: items.length === 0 ? 'default' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'transform 0.1s active, opacity 0.2s'
            }}
          >
            Checkout
          </button>
          
          <div style={{ 
            textAlign: 'center', 
            marginTop: '16px', 
            fontSize: '11px', 
            color: '#aaa',
            fontWeight: '500'
          }}>
            Shipping and taxes calculated at checkout.
          </div>
        </div>
      </div>
    </>
  );
}