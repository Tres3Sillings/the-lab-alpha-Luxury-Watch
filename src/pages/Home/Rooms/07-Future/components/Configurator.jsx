import React, { useState, useEffect } from 'react';

export default function Configurator({ product, config, setConfig }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!product) return null;

  const options = product.customization || { colors: [], materials: [], layouts: [] };

  // Desktop Style: Floating Sidebar
  const desktopStyle = {
    position: 'absolute',
    right: 40,
    top: '40%',
    transform: 'translateY(-50%)',
    width: '320px',
    borderRadius: '24px',
    flexDirection: 'column',
    gap: '28px', // Increased gap for desktop breathability
    padding: '28px', // Added padding for desktop
  };

  // Mobile Style: Elegant Bottom Drawer
  const mobileStyle = {
    position: 'relative', 
    width: '100%',
    borderRadius: '24px 24px 0 0',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px',
    boxSizing: 'border-box',
    borderBottom: 'none',
  };

  const containerStyle = {
    ...(isMobile ? mobileStyle : desktopStyle),
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
    zIndex: 10,
    display: 'flex',
    animation: 'slideIn 0.4s ease-out',
    boxSizing: 'border-box' // Added to ensure padding doesn't break width
  };

  return (
    <div style={containerStyle}>
      <div style={{ paddingBottom: isMobile ? '0px' : '4px' }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: isMobile ? '16px' : '18px', 
          fontWeight: '700', 
          color: '#111', 
          textTransform: 'uppercase', 
          letterSpacing: '0.5px' 
        }}>
            {product.id.split('_').join(' ')}
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#666', lineHeight: '1.4' }}>{product.style}</p>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'row' : 'column', 
        gap: isMobile ? '20px' : '24px', 
        overflowX: isMobile ? 'auto' : 'visible',
        paddingBottom: isMobile ? '10px' : '0'
      }}>
        
        {/* DYNAMIC COLORS */}
        {options.colors?.length > 0 && (
          <div style={{ minWidth: isMobile ? '100px' : 'auto', flexShrink: 0 }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#999', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Color</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {options.colors.map(hex => (
                <button 
                  key={hex}
                  onClick={() => setConfig({ ...config, color: hex })}
                  style={{
                    width: '26px', height: '26px', borderRadius: '50%', background: hex,
                    border: config.color === hex ? '2px solid #000' : '2px solid transparent',
                    cursor: 'pointer', padding: 0, flexShrink: 0,
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
            </div>
          </div>
        )}

        {/* DYNAMIC MATERIALS */}
        {options.materials?.length > 0 && (
          <div style={{ minWidth: isMobile ? '140px' : 'auto', flexShrink: 0 }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#999', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Material</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
              {options.materials.map(mat => (
                <button
                  key={mat}
                  onClick={() => setConfig({ ...config, material: mat })}
                  style={{
                    padding: '8px 14px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
                    background: config.material === mat ? '#111' : 'rgba(0,0,0,0.05)',
                    color: config.material === mat ? '#fff' : '#333',
                    border: 'none', transition: 'all 0.2s ease'
                  }}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DYNAMIC LAYOUTS */}
        {options.layouts?.length > 0 && (
          <div style={{ minWidth: isMobile ? '140px' : 'auto', flexShrink: 0 }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#999', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Config</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
              {options.layouts.map(layout => (
                <button
                  key={layout}
                  onClick={() => setConfig({ ...config, layout: layout })}
                  style={{
                    padding: '8px 14px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
                    background: config.layout === layout ? '#111' : 'rgba(0,0,0,0.05)',
                    color: config.layout === layout ? '#fff' : '#333',
                    border: 'none', transition: 'all 0.2s ease'
                  }}
                >
                  {layout}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}