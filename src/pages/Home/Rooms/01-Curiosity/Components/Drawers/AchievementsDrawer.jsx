import React from 'react'

export const ACHIEVEMENTS = [
  { id: 'curiosity', title: 'Curiosity', desc: 'Inspect HTML and break websites just to see how they work.', icon: '🖥️' },
  { id: 'builder', title: 'Builder', desc: 'Every finished project started as a terrible sketch.', icon: '📖' },
  { id: 'wrong_turn', title: 'Wrong Turn', desc: 'Sometimes the wrong road gets you exactly where you needed to go.', icon: '🧮' },
  { id: 'night_owl', title: 'Night Owl', desc: 'Coffee consumed (estimated): ~2,100 cups. Best ideas usually after midnight.', icon: '☕' },
  { id: 'designer', title: 'Designer', desc: 'Unlock Photoshop skill. UI Design, mockups, and client graphics.', icon: '🎨' },
  { id: 'creator', title: 'Creator', desc: 'Unlock Blender skill. Immersive experiences and 3D modeling renders.', icon: '📦' },
  { id: 'developer', title: 'Developer', desc: 'Unlock React skill. Components, state management, and 3D integration.', icon: '⚛️' },
  { id: 'wordpress', title: 'WP Master', desc: '40+ custom pages built. Custom plugins and speedy client work.', icon: '🌐' },
  { id: 'creative_coder', title: 'Creative Coder', desc: 'Three.js, GLSL, and Theatre.js cinematic websites.', icon: '⚡' },
  { id: 'storyteller',    title: 'Storyteller',    desc: 'Discover the Camera section (Locked - Future Section).', icon: '📷', lockedText: 'Locked - Camera Section' },
  { id: 'lofi_vibes',    title: 'Lo-Fi Vibes',    desc: 'Hit play on the cassette lo-fi synth player and let the beats roll.', icon: '📻' },
  { id: 'confetti_king', title: 'Confetti King',  desc: 'Pop the confetti cannon. Because why not.', icon: '🎊' },
]

export default function AchievementsDrawer({
  showAchievements,
  setShowAchievements,
  unlocked,
  claimedAchievements,
  handleClaimPoints
}) {
  const coreIds = ['curiosity', 'builder', 'designer', 'developer', 'creator']
  const coreUnlockedCount = unlocked.filter(id => coreIds.includes(id)).length
  const completionPercent = Math.round((coreUnlockedCount / 5) * 100)

  return (
    <div className={`achievements-drawer ${showAchievements ? 'open' : ''}`}>
      <div className="drawer-header">
        <h3>🏆 PORTFOLIO ACHIEVEMENTS</h3>
        <button className="close-drawer" onClick={() => setShowAchievements(false)}>×</button>
      </div>
      
      <div className="progress-section">
        <div className="progress-label">
          <span>Story Completion</span>
          <span>{completionPercent}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <div className="progress-summary">
          {coreUnlockedCount} of 5 Core Collectibles Unlocked
        </div>
      </div>

      <div className="achievements-list">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlocked.includes(ach.id)
          const isStoryteller = ach.id === 'storyteller'
          const isClaimed = claimedAchievements.includes(ach.id)
          return (
            <div key={ach.id} className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
              <div className="achievement-icon-wrapper">
                <span className="achievement-icon">{isUnlocked ? ach.icon : '🔒'}</span>
              </div>
              <div className="achievement-info">
                <div className="achievement-title-row">
                  <span className="achievement-title">{ach.title}</span>
                  {isUnlocked && (
                    <div className="claim-action-wrapper">
                      {isClaimed ? (
                        <span className="checkmark">💰 CLAIMED</span>
                      ) : (
                        <button 
                          className="claim-points-btn"
                          onClick={(e) => handleClaimPoints(ach.id, e.clientX, e.clientY)}
                        >
                          🎁 CLAIM 50 PTS
                        </button>
                      )}
                    </div>
                  )}
                  {!isUnlocked && isStoryteller && <span className="locked-badge">Locked Section</span>}
                </div>
                <p className="achievement-desc">
                  {isUnlocked ? ach.desc : (isStoryteller ? ach.lockedText : 'Click interactive elements in the room to discover.')}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
