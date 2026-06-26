import React from 'react'

export default function LaptopPanel({ navigate }) {
  return (
    <div className="folder-grid">
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>02 / 3D ROOM PLAYGROUND</h1>
          <h2>Custom 3D Scene Configurator</h2>
        </div>
        <p className="folder-desc">
          A fully interactive 3D editor built in React Three Fiber that lets users design and organize interior rooms.
          {"\n\n"}
          Experiment with dynamic layout systems, custom lights, shadows, and gltf asset placement in real-time.
          {"\n\n"}
          Click the button below to launch the interactive demo page.
        </p>
        
        <button 
          className="play-lofi-btn playing" 
          style={{ marginTop: '20px', width: 'auto', alignSelf: 'flex-start', padding: '12px 24px' }}
          onClick={() => navigate('/editor-demo')}
        >
          🚀 Launch 3D Playground
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
