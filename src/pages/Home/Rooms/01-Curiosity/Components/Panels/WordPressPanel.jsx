import React from 'react'
import WordPressMock from '../MockPanels/WordPressMock'

export default function WordPressPanel() {
  return (
    <div className="folder-grid">
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>01 / WORDPRESS</h1>
          <h2>Skill Book: WordPress</h2>
        </div>

        <p className="folder-desc" style={{ whiteSpace: 'pre-line' }}>
          {"40+ Pages Built\nCustom Plugins:\n✓ WP Updater\n✓ WP Reviewer\n✓ WP Replacer\n\nFavorite Part: Making clients happy quickly.\n\nWordPress is the workhorse of the modern web, powering over 40% of all websites. While custom React builds are great for high-end web applications, many businesses need speed, easy content management, and robust SEO out of the box. That is where WordPress shines.\n\nI have designed, built, and deployed over 40 custom WordPress sites for clients in various industries. I don't rely on heavy, bloated page builders that slow down performance. Instead, I write custom block themes, write clean PHP templates, and develop bespoke plugins to solve specific business needs. This hybrid approach gives clients the best of both worlds: a fast, secure website that is incredibly easy for their marketing teams to update without developer intervention."}
        </p>

        <div className="folder-lesson-box">
          <span className="folder-lesson-tag">🔑 What I Learned</span>
          <p className="folder-lesson-text">Speed, customer focus, and custom tooling are invaluable assets.</p>
        </div>
      </div>

      <div className="folder-col-right">
        <WordPressMock />
      </div>
    </div>
  )
}
