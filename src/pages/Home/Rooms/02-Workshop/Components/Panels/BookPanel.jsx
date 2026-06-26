import React from 'react'

export default function BookPanel({ navigate }) {
  return (
    <div className="folder-grid">
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>02 / NIKE CUSTOMIZER</h1>
          <h2>Three.js Sneaker Colorizer</h2>
        </div>
        <p className="folder-desc">
          Interactive Nike shoe customization workbench.
          {"\n\n"}
          Select specific mesh segments (swoosh, laces, sole, collar) and paint them with high-fidelity materials, orbit control viewing, and touch gestures.
          {"\n\n"}
          Click below to start customizing.
        </p>
        
        <button 
          className="play-lofi-btn playing" 
          style={{ marginTop: '20px', width: 'auto', alignSelf: 'flex-start', padding: '12px 24px' }}
          onClick={() => navigate('/shoe')}
        >
          🚀 Customize Sneaker
        </button>
      </div>
      
      <div className="folder-col-right">
        <div className="folder-media-container" style={{ marginTop: '40px' }}>
          <div style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '6px', textAlign: 'center', fontFamily: 'monospace', color: '#c5a880', fontSize: '12px' }}>
            <div>WORKBENCH PROJECT DECALS ACTIVE</div>
            <div style={{ marginTop: '10px', color: '#888' }}>Select component highlights to inspect configuration lines.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
