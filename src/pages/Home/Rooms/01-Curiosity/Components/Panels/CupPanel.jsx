import React from 'react'

export default function CupPanel() {
  return (
    <div className="folder-grid">
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>01 / COFFEE MUG</h1>
          <h2>Night Owl Statistics</h2>
        </div>

        <p className="folder-desc" style={{ whiteSpace: 'pre-line' }}>
          {"Coffee Consumed (Estimated): ~2,100 cups\nLate nights: Too many\nBest ideas: Usually after midnight\n\nFavorite debugging strategy: Walk away. Drink coffee. Come back.\n\nThere is an old joke in computer science: \"A programmer is a machine for turning caffeine into code.\" While it is a cliche, my coffee mug has been my silent partner through every late-night deployment and confusing console error. It has sat beside my keyboard through countless build cycles and design iterations.\n\nSome of my most complex engineering breakthroughs didn't happen while staring at a code editor. They happened while standing in the kitchen, waiting for the coffee machine to brew. There is magic in taking a physical break from a problem. When you walk away, your brain continues to process the logic in the background. By the time you sit back down with a hot mug, the missing semicolon or architectural flaw suddenly becomes obvious.\n\nKey Coffee Analytics:\n• Peak Debugging Hours: 11:00 PM - 3:00 AM\n• Preferred Roast: Dark, strong, and black\n• Troubleshooting Efficacy: +45% post-caffeine infusion\n• Cold Coffee Tolerance: Surprisingly high (when deep in a state flow)\n\nIt's not just a drink; it's a productivity system."}
        </p>

        <div className="folder-lesson-box">
          <span className="folder-lesson-tag">🔑 What I Learned</span>
          <p className="folder-lesson-text">Estimate: 2,100 cups consumed. Best ideas usually come after midnight.</p>
        </div>
      </div>

      <div className="folder-col-right">
        <div className="folder-media-container">
          <img src="/coffee_desk.png" alt="Steaming coffee desk setup" className="folder-media-img" />
          <div className="folder-media-caption">Late night fuel. Est. 2,100 cups consumed.</div>
        </div>
      </div>
    </div>
  )
}
