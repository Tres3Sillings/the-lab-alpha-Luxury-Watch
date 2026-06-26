import React from 'react'

export default function NotebookPanel() {
  return (
    <div className="folder-grid">
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>01 / NOTEBOOK</h1>
          <h2>Idea Book</h2>
        </div>

        <p className="folder-desc" style={{ whiteSpace: 'pre-line' }}>
          {"This is where ideas spend time. Inside:\n\n• First website sketches\n• Terrible logo ideas\n• Pricing notes & dreams\n• Future business names\n\nBefore I write a single line of CSS or open Figma, I grab a pencil and this physical notebook. There is something tactile and immediate about paper that digital tools can't replicate. It is a sandbox with zero latency and infinite undo states (via an eraser).\n\nMy notebooks are filled with chaotic grids, wireframes with arrows pointing in every direction, and messy lists of features that may never see the light of day. I sketch mobile navigation drawers, layout grids, and hover interactions as rough wireframes. It's a filter system: if an idea doesn't look promising in a quick paper sketch, it probably doesn't deserve hours of frontend engineering. Looking back through these pages is like walking through a graveyard of half-formed dreams and successful prototypes. It shows the evolution of my design thinking and the messy, iterative process that leads to a polished end product.\n\nEvery great product, clean interface, and complex 3D scene starts as a rough, imperfect scribble in a physical notebook. It's the bridge between imagination and code."}
        </p>

        <div className="folder-lesson-box">
          <span className="folder-lesson-tag">🔑 What I Learned</span>
          <p className="folder-lesson-text">Every finished project started as a terrible sketch.</p>
        </div>
      </div>

      <div className="folder-col-right">
        <div className="folder-media-container">
          <img src="/notebook_sketch.png" alt="Notebook design sketch" className="folder-media-img" />
          <div className="folder-media-caption">Page scan from idea sketches. All big projects start rough.</div>
        </div>
      </div>
    </div>
  )
}
