import React from 'react'

export default function PhotoshopPanel() {
  return (
    <div className="folder-grid">
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>01 / PHOTOSHOP</h1>
          <h2>Skill Book: Photoshop (Level 80%)</h2>
        </div>

        <p className="folder-desc" style={{ whiteSpace: 'pre-line' }}>
          {"Started: 2022\nProjects: 100+\n\nFavorite Uses:\n✓ UI Design\n✓ Mockups\n✓ Clothing design\n✓ Client Graphics\n\nProgress to Master:\n[████████░░]\n\nMy design journey began with raster graphics. Photoshop taught me the fundamentals of composition, color theory, typography, and visual hierarchy. Long before I knew what a responsive layout was, I was manipulating layers, blending paths, and masking textures to create web graphics and branding materials.\n\nToday, I use Photoshop as a supporting pillar for my web engineering projects. Whether I'm optimizing asset textures for 3D GLTF models, creating custom high-contrast normal maps, or designing high-fidelity layouts, my familiarity with the Adobe suite gives me a major advantage. It allows me to bridge the gap between creative visual art and technical implementation. I don't just write code for layouts; I design the assets, icons, and visual elements that inhabit them. This dual capability ensures that the websites I build look exactly as the design mockup intended, down to the last pixel."}
        </p>

        <div className="folder-lesson-box">
          <span className="folder-lesson-tag">🔑 What I Learned</span>
          <p className="folder-lesson-text">Great design isn't decoration. It's communication.</p>
        </div>
      </div>

      <div className="folder-col-right">
        <div className="folder-media-container">
          <img src="/photoshop_ui.png" alt="Photoshop interface design mockup" className="folder-media-img" />
          <div className="folder-media-caption">UI mockups, graphics, and apparel designs catalog.</div>
        </div>
      </div>
    </div>
  )
}
