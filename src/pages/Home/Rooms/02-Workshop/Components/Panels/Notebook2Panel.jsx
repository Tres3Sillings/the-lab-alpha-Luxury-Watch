import React from 'react'

export default function Notebook2Panel({ navigate }) {
  return (
    <div className="folder-grid">
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>02 / KING'S MAKER FORGE</h1>
          <h2>3D Sword Builder</h2>
        </div>
        <p className="folder-desc">
          Step into the custom forge and assemble blades, handles, and guards with metallic reflection overlays.
          {"\n\n"}
          Choose colors and select parts visually.
        </p>
        
        <button 
          className="play-lofi-btn playing" 
          style={{ marginTop: '20px', width: 'auto', alignSelf: 'flex-start', padding: '12px 24px' }}
          onClick={() => navigate('/forge')}
        >
          🚀 Enter Forge
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
