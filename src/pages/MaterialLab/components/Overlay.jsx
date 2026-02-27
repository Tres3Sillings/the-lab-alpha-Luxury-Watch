import React from 'react';
import { Link } from 'react-router-dom'; // Essential for navigation

export default function Overlay({ isGlitching }) {
  const glitchClass = isGlitching ? "glitch-active" : "";

  return (
    <div className="blueprint-overlay">
      {/* Navigation Link - Uses neon green to match Forbidden.Thread aesthetic */}
      <Link 
        to="/home" 
        state={{ from: 'material-lab' }}
        className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#00ff88]/40 hover:text-[#00ff88] transition-colors"
        style={{ 
          position: 'absolute',
          top: '100px',
          left: '52px',
          pointerEvents: 'auto', // Overrides 'none' on parent to allow clicks
          zIndex: 20,
          textDecoration: 'none'
        }}
      >
        <span className={glitchClass}>← BACK</span>
      </Link>

      {/* Existing HUD Elements */}
      <div className="corner top-left" style={{ marginTop: '0px' }}> {/* Increased margin to clear link */}
        <div className="label">PROJECT_ID</div>
        <div className={`value ${glitchClass}`}>LAB_ALPHA_v1.0.4</div>
      </div>

      <div className="corner top-right">
        <div className="label">SYSTEM_STATUS</div>
        <div className={`value status-blink ${glitchClass}`}>
          {isGlitching ? "ERROR_DATA_CORRUPTION" : "RENDER_ACTIVE"}
        </div>
      </div>

      <div className="corner bottom-left">
        <div className="label">CORE_MODULES</div>
        <div className="value">R3F // GLSL // THREE.js</div>
      </div>

      <div className="corner bottom-right">
        <div className="label">INTERACTION</div>
        <div className="value">SCRL_TO_INSPECT</div>
      </div>

      <div className="center-crosshair">
        <div className={`line-h ${glitchClass}`}></div>
        <div className={`line-v ${glitchClass}`}></div>
      </div>

      <div className="side-bar left">
        <div className="scanner-line"></div>
      </div>
    </div>
  );
}