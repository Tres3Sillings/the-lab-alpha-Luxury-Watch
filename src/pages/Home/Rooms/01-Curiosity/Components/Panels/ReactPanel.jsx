import React from 'react'
import ReactMock from '../MockPanels/ReactMock'

export default function ReactPanel() {
  return (
    <div className="folder-grid">
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>01 / REACT</h1>
          <h2>Skill Book: React</h2>
        </div>

        <p className="folder-desc" style={{ whiteSpace: 'pre-line' }}>
          {"Timeline:\nFirst component → Three.js R3F integration → Custom Portfolio → Forbidden Thread → CRM system → Today\n\nReact is the standard for building complex, dynamic web applications. It completely transformed my frontend workflow. By breaking down pages into modular, state-driven components, I could build scalable systems that handle user interactions and data flows with ease.\n\nMy React journey started with simple functional components and state hooks, but quickly expanded into state management libraries, custom hooks, and rendering integration. React is the bridge that allows me to mount a Three.js canvas, sync 3D models with DOM overlays, handle achievement tracking in localStorage, and manage smooth page transitions. It is the core framework that brings all my interactive ideas together in a cohesive, performant runtime environment."}
        </p>

        <div className="folder-lesson-box">
          <span className="folder-lesson-tag">🔑 What I Learned</span>
          <p className="folder-lesson-text">React is the backbone for scaling component-driven interactive user interfaces.</p>
        </div>
      </div>

      <div className="folder-col-right">
        <ReactMock />
      </div>
    </div>
  )
}
