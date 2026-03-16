import React, { useState, useEffect } from 'react';
import '@google/model-viewer';

export default function ProductDisplay({ product, config }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Listener to handle the padding switch between mobile and desktop
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!product) return null;

  const wrapperStyle = {
    width: '100%', 
    height: '100%', 
    padding: isMobile ? '20px' : '60px', 
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    animation: 'fadeIn 0.5s ease-out'
  };

  const contentStyle = {
    width: '100%',
    height: '100%',
    maxWidth: '1000px', 
    maxHeight: '80vh', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  };

  // --- THE 3D ROUTE ---
  if (product.modelUrl) {
    return (
      <div style={wrapperStyle}>
        <div style={contentStyle}>
          <model-viewer
            src={product.modelUrl}
            ios-src={product.iosUrl}
            alt={`A 3D model of ${product.style}`}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            environment-image="neutral"
            shadow-intensity="1"
            style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
          >
            <button 
              slot="ar-button" 
              style={{
                position: 'absolute', bottom: '16px', right: '16px', zIndex: 20,
                background: '#000', color: '#fff', border: 'none', borderRadius: '24px', 
                padding: '12px 24px', fontWeight: 'bold', cursor: 'pointer',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }}
            >
              View in AR
            </button>
          </model-viewer>
        </div>
      </div>
    );
  }

  // --- THE 2D ROUTE ---
  return (
    <div style={wrapperStyle}>
      <div style={contentStyle}>
        <img 
          src={product.imageUrl} 
          alt={product.style}
          style={{
            width: '100%', 
            height: '100%', 
            objectFit: 'contain', 
            filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.12))',
            transition: 'all 0.3s ease'
          }}
        />
        
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          background: 'rgba(255,255,255,0.9)', 
          padding: '4px 10px', borderRadius: '8px', 
          fontSize: '10px', fontWeight: '800', color: '#000',
          letterSpacing: '0.5px', border: '1px solid #eee'
        }}>
          PREVIEW
        </div>
      </div>
    </div>
  );
}