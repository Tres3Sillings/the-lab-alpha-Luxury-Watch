import React from 'react'
import ThreeJsMock from '../MockPanels/ThreeJsMock'

export default function ThreeJsPanel() {
  return (
    <div className="folder-grid">
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>01 / THREE.JS</h1>
          <h2>Skill Book: Three.js & Creative Coding</h2>
        </div>

        <p className="folder-desc" style={{ whiteSpace: 'pre-line' }}>
          {"Unlocking 3D interactive graphics on the browser canvas.\n\nFavorite APIs:\n✓ Custom GLSL shaders\n✓ Physics engines\n✓ Theatre.js animations\n\nBelief: The web should be an interactive experience, not just dry papers.\n\nThree.js is where code meets art. It is the technology that allows me to render millions of polygons, control camera viewports, and program customized lighting systems directly in the browser. By combining Three.js with React Three Fiber (R3F), I can treat 3D objects as standard React components, syncing their state and hooks with normal DOM events.\n\nI specialize in creative coding: writing custom vertex and fragment shaders in GLSL, configuring cinematic animations via Theatre.js, and implementing physics simulations. The goal is to build digital experiences that feel alive, responsive, and awe-inspiring. I believe the future of the web belongs to immersive storytelling, and Three.js is the key that unlocks it."}
        </p>

        <div className="folder-lesson-box">
          <span className="folder-lesson-tag">🔑 What I Learned</span>
          <p className="folder-lesson-text">The web is evolving from dry pages into rich interactive visual experiences.</p>
        </div>
      </div>

      <div className="folder-col-right">
        <ThreeJsMock />
      </div>
    </div>
  )
}
