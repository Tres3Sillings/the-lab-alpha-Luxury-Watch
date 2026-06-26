import React from 'react'

export default function CupPanel() {
  return (
    <div className="folder-grid">
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>02 / CODING STATS</h1>
          <h2>Late Night Code Fuel</h2>
        </div>
        <p className="folder-desc">
          Ambient stats dashboard tracking caffeine inputs and developer hours.
          {"\n\n"}
          Est. 2,100 cups consumed. Best ideas usually come after midnight.
        </p>
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
