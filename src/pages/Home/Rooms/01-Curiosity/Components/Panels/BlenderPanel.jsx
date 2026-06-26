import React from 'react'

export default function BlenderPanel() {
  return (
    <div className="folder-grid">
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>01 / BLENDER</h1>
          <h2>Skill Book: Blender (Current Obsession)</h2>
        </div>

        <p className="folder-desc" style={{ whiteSpace: 'pre-line' }}>
          {"First Render → Current Render\n\nFavorite Things:\n• Architecture design\n• Lighting & Materials\n• Three.js implementation\n\nFuture Goal: Full cinematic 3D websites.\n\nWhen I first opened Blender, the three-dimensional viewport felt incredibly intimidating. There were countless shortcuts, rendering settings, shader nodes, and modifiers. But the moment I completed my first simple render, I was hooked. I realized that the browser didn't have to be a flat, two-dimensional document. It could be an interactive window into a virtual space.\n\nI spent months mastering low-poly modeling, UV unwrapping, material baking, and scene optimization. The true challenge of 3D web development is performance: taking a detailed scene and optimizing it so it loads instantly on a phone over a cellular connection. Today, I model custom assets, configure photorealistic baking sheets, and export highly optimized GLB files that integrate seamlessly with React Three Fiber. Blender has completely redefined my perspective on web design."}
        </p>

        <div className="folder-lesson-box">
          <span className="folder-lesson-tag">🔑 What I Learned</span>
          <p className="folder-lesson-text">Building immersive experiences made me rethink what a website could be.</p>
        </div>
      </div>

      <div className="folder-col-right">
        <div className="folder-media-container">
          <img src="/blender_render.png" alt="Blender workspace cyberpunk rendering" className="folder-media-img" />
          <div className="folder-media-caption">Blender space design render. Building cinematic worlds.</div>
        </div>
      </div>
    </div>
  )
}
