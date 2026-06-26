import React from 'react'
import TerminalMock from '../MockPanels/TerminalMock'

export default function PCPanel() {
  return (
    <div className="folder-grid">
      {/* Left Column: Narrative & Insights */}
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>01 / CRT COMPUTER</h1>
          <h2>Curiosity</h2>
        </div>

        <p className="folder-desc" style={{ whiteSpace: 'pre-line' }}>
          {"This shouldn't be about computers. It's about learning.\n\nBreaking websites, inspecting HTML, wondering how buttons worked, and opening DevTools for the first time.\n\nIt all started with a vintage CRT monitor and a slow dial-up connection. Back then, websites weren't just content platforms; they were mysteries waiting to be solved. I remember right-clicking on pages and selecting \"View Source Code\" for the first time. A wall of text filled the screen—nested divs, cryptic scripts, and inline styles that made no sense but somehow rendered beautiful interfaces on my screen.\n\nI began my journey by editing the HTML directly in the browser's developer console. I would change the text on a news site, alter background colors, or hide elements to see how the layout adapted. The feeling of power was immediate: with a few keystrokes, I could manipulate the pixels on my screen. I wasn't trying to become a professional software engineer; I was simply playing a game of digital lego.\n\nThis machine symbolizes that pure, unadulterated curiosity. It represents the hours spent debugging broken tags late at night, search queries on old forums, and the excitement of making a button do exactly what I wanted. It's a reminder that the best developers aren't driven by certificates, but by the irresistible urge to click \"Inspect\" and ask: \"How does this work under the hood?\""}
        </p>

        <div className="folder-lesson-box">
          <span className="folder-lesson-tag">🔑 What I Learned</span>
          <p className="folder-lesson-text">I wasn't trying to become a developer. I just couldn't stop asking "How does this work?"</p>
        </div>
      </div>

      {/* Right Column: Custom Visual / Graphics / Interactive Panels */}
      <div className="folder-col-right">
        <TerminalMock />
      </div>
    </div>
  )
}
