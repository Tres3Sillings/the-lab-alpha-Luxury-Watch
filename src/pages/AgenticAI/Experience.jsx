import React, { useState, useEffect } from "react";
import DecoratorChat from "./components/DecoratorChat";
import TopNav from "./components/TopNav";
import Configurator from "./components/Configurator";
import ProductDisplay from "./components/ProductDisplay"; 
import RecommendationsRail from "./components/RecommendationsRail";
import CartDrawer from "./components/CartDrawer";
import CheckoutPage from "./components/CheckoutPage"; // New Import

export default function Experience() {
  const [activeSet, setActiveSet] = useState({ 
  primary: null, 
  collection: [], 
  originalHero: null // <--- Add this to track the AI's first choice
});
  const [currentView, setCurrentView] = useState('chat'); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Cart & Checkout State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const [productConfig, setProductConfig] = useState({
    color: '#000000', material: 'Standard', layout: 'Default'
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStylistUpdate = (newSet) => {
  if (newSet?.primary) {
    setActiveSet({
      primary: newSet.primary,
      collection: newSet.collection || [],
      originalHero: newSet.primary // <--- Lock in the original recommendation
    });
  } else if (newSet) {
    // If the user manually clicks an item in the rail or search
    setActiveSet(prev => ({ ...prev, primary: newSet }));
  }
};

  const addToCart = () => {
    if (!activeSet.primary) return;
    const newItem = {
      ...activeSet.primary,
      config: { ...productConfig },
      cartId: Date.now()
    };
    setCart([...cart, newItem]);
    setIsCartOpen(true); 
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const completePurchase = () => {
    alert("Order Placed! Your LUMIÈRE pieces are being prepared.");
    setCart([]);
    setIsCheckingOut(false);
    setIsCartOpen(false);
  };

  return (
    <div style={{ 
      width: '100vw', height: '100dvh', display: 'flex', flexDirection: 'column', 
      background: '#fff', position: 'relative', overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      
      {/* 0. OVERLAYS (Cart & Checkout) */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemove={removeFromCart} 
        onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckingOut(true);
        }}
      />

      {isCheckingOut && (
        <CheckoutPage 
            items={cart} 
            onBack={() => setIsCheckingOut(false)} 
            onComplete={completePurchase} 
        />
      )}

      {/* MAIN LAYOUT CONTAINER */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        
        {/* 1. TOP NAVIGATION */}
        <TopNav 
            onSelectProduct={handleStylistUpdate} 
            cartCount={cart.length} 
            onOpenCart={() => setIsCartOpen(true)} 
        />

        {/* 2. STAGE (The Furniture) */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
          <ProductDisplay product={activeSet.primary} config={productConfig} />
          
          {activeSet.primary && (
            <div style={{ 
              position: 'absolute', bottom: '20px', right: '20px', 
              background: '#000', color: '#fff', padding: '12px 24px', 
              borderRadius: '40px', fontWeight: '800', fontSize: '20px', zIndex: 5,
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}>
              ${activeSet.primary.price || "1850"}
            </div>
          )}
        </div>

        {/* 3. THE UI BOTTOM PANEL */}
        <div style={{ 
          background: 'rgba(255,255,255,0.98)', 
          borderTop: '1px solid #eee',
          zIndex: 10,
          paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 20px)' : '20px'
        }}>
          
          {/* RAIL: Selection UI */}
          <div style={{ padding: '15px 0' }}>
            <RecommendationsRail 
              activeProduct={activeSet.primary} 
              collection={activeSet.collection}
              onSelectProduct={handleStylistUpdate} 
            />
          </div>

          {/* TABS & ADD TO CART */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px 15px' }}>
            <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: '12px', padding: '4px' }}>
              <button 
                onClick={() => setCurrentView('chat')}
                style={{ 
                  padding: '8px 16px', border: 'none', borderRadius: '8px', 
                  background: currentView === 'chat' ? '#fff' : 'transparent', 
                  fontWeight: '700', fontSize: '12px', cursor: 'pointer', color: '#000',
                  boxShadow: currentView === 'chat' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Stylist
              </button>
              <button 
                onClick={() => setCurrentView('config')}
                style={{ 
                  padding: '8px 16px', border: 'none', borderRadius: '8px', 
                  background: currentView === 'config' ? '#fff' : 'transparent', 
                  fontWeight: '700', fontSize: '12px', cursor: 'pointer', color: '#000',
                  boxShadow: currentView === 'config' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Customize
              </button>
            </div>

            <button 
              onClick={addToCart}
              style={{ 
                marginLeft: 'auto', background: '#000', color: '#fff', border: 'none', 
                padding: '14px 30px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', 
                fontSize: '13px', transition: 'transform 0.1s active'
              }}
            >
              Add to Cart
            </button>
          </div>

          {/* ACTIVE TOOL VIEW */}
          <div style={{ width: '100%', minHeight: '100px' }}>
            {currentView === 'chat' ? (
              <DecoratorChat onRecommendation={handleStylistUpdate} />
            ) : (
              <Configurator 
                product={activeSet.primary} 
                config={productConfig} 
                setConfig={setProductConfig} 
              />
            )}
          </div>
        </div> 

      </div> 
    </div>
  );
}