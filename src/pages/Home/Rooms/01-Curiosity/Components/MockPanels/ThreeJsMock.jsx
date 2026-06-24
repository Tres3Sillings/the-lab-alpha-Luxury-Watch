import React from 'react'

export default function ThreeJsMock() {
  return (
    <div className="threejs-mock">
      <div className="threejs-badge">
        <span>3D CANVAS INTERPOLATION ACTIVE</span>
      </div>
      <div className="threejs-grid">
        <div className="threejs-cell">
          <span className="three-label">Renderer</span>
          <span className="three-val">WebGL2Renderer</span>
        </div>
        <div className="threejs-cell">
          <span className="three-label">Shaders</span>
          <span className="three-val">Custom GLSL</span>
        </div>
        <div className="threejs-cell">
          <span className="three-label">Timeline</span>
          <span className="three-val">Theatre.js Sheet</span>
        </div>
        <div className="threejs-cell">
          <span className="three-label">Framerate</span>
          <span className="three-val">60 FPS</span>
        </div>
      </div>
    </div>
  )
}
