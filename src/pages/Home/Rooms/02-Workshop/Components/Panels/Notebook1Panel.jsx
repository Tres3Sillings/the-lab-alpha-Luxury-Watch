import React from 'react'

export default function Notebook1Panel({ navigate }) {
  return (
    <div className="folder-grid">
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>02 / COFFIN DESIGNER</h1>
          <h2>Skeuomorphic Configurator Workbench</h2>
        </div>
        <p className="folder-desc">
          A creative configuration app showcasing custom wood textures, parameters for metallic trim, and custom hardware accessories for 3D modeling renders.
          {"\n\n"}
          Built in React Three Fiber and OrbitControls.
        </p>
        
        <button 
          className="play-lofi-btn playing" 
          style={{ marginTop: '20px', width: 'auto', alignSelf: 'flex-start', padding: '12px 24px' }}
          onClick={() => navigate('/coffin-editor')}
        >
          🚀 Launch Coffin Editor
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
