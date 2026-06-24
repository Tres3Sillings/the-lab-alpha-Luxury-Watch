import React from 'react';

export default function CheckoutPage({ items, onBack, onComplete }) {
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const shipping = 0; // Free shipping for luxury goods
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: '#fff', zIndex: 1000, display: 'flex', flexDirection: 'column',
      animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      fontFamily: '-apple-system, sans-serif', color: '#000'
    }}>
      
      {/* Header */}
      <div style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '20px' }}>←</button>
        <h1 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px' }}>LUMIÈRE CHECKOUT</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', overflowY: 'auto' }}>
        
        {/* Left Side: Form */}
        <div style={{ flex: 1, padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '20px', textTransform: 'uppercase' }}>Shipping Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input placeholder="Full Name" style={inputStyle} />
              <input placeholder="Email Address" style={inputStyle} />
              <input placeholder="Street Address" style={inputStyle} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <input placeholder="City" style={{ ...inputStyle, flex: 2 }} />
                <input placeholder="Zip" style={{ ...inputStyle, flex: 1 }} />
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '20px', textTransform: 'uppercase' }}>Payment</h3>
            <div style={{ padding: '20px', border: '1px solid #000', borderRadius: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '15px' }}>Credit Card</div>
              <input placeholder="Card Number" style={inputStyle} />
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <input placeholder="MM/YY" style={inputStyle} />
                <input placeholder="CVC" style={inputStyle} />
              </div>
            </div>
          </section>

          <button 
            onClick={onComplete}
            style={{ 
              width: '100%', background: '#000', color: '#fff', border: 'none', 
              padding: '20px', borderRadius: '14px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' 
            }}
          >
            Pay ${total.toFixed(2)}
          </button>
        </div>

        {/* Right Side: Order Summary (Visible on Desktop) */}
        <div style={{ 
          width: window.innerWidth < 768 ? '100%' : '400px', 
          background: '#f9f9f9', padding: '40px', borderLeft: '1px solid #eee' 
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '24px', textTransform: 'uppercase' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {items.map(item => (
              <div key={item.cartId} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee' }}>
                  <img src={item.imageUrl} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1, fontSize: '13px' }}>
                  <div style={{ fontWeight: '700' }}>{item.id.replace(/_/g, ' ')}</div>
                  <div style={{ color: '#888' }}>{item.config.material}</div>
                </div>
                <div style={{ fontWeight: '700' }}>${item.price}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
            <div style={summaryRow}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div style={summaryRow}><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div style={summaryRow}><span>Shipping</span><span>Free</span></div>
            <div style={{ ...summaryRow, marginTop: '20px', fontSize: '18px', fontWeight: '900' }}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box'
};

const summaryRow = {
  display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px'
};