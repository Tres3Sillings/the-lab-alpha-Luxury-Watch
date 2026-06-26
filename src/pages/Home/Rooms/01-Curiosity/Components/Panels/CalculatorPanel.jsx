import React from 'react'
import CalculatorMock from '../MockPanels/CalculatorMock'

export default function CalculatorPanel() {
  return (
    <div className="folder-grid">
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>01 / CALCULATOR</h1>
          <h2>The Last Time I Used This</h2>
        </div>

        <p className="folder-desc" style={{ whiteSpace: 'pre-line' }}>
          {"Thankfully JavaScript does the math now. 😂\n\nTurns out I still use math... it's just measured in pixels instead of spreadsheets.\n\nIn my accounting days, the desktop calculator was an extension of my hand. I would punch in numbers with rapid-fire speed, checking decimal points and tallying balances. It was an analog tool for a digital chore. Today, that calculator sits as a museum piece on my desk, collecting dust while my code handles millions of floating-point operations in microseconds.\n\nBut math didn't disappear when I switched to development. It just evolved. Instead of adding interest rates and balancing depreciation schedules, I now use math to calculate vector coordinates, translate 3D quaternions, interpolate animation frames, and scale layouts. Math is no longer a chore; it's a creative brush. When you see a camera smoothly panning across a 3D canvas or a particle system exploding into a vortex of light, you are looking at mathematics in motion.\n\nHere is a quick comparison of my math workflow then versus now:\n\n• Then: Total = Principal * (1 + Rate/Time)^(Time * Years)\n• Now: position.x = Math.sin(state.clock.getElapsedTime()) * radius\n\nI swapped cell formulas for trigonometry, and I couldn't be happier."}
        </p>

        <div className="folder-lesson-box">
          <span className="folder-lesson-tag">🔑 What I Learned</span>
          <p className="folder-lesson-text">Sometimes the "safe" career isn't the right one.</p>
        </div>
      </div>

      <div className="folder-col-right">
        <CalculatorMock />
      </div>
    </div>
  )
}
