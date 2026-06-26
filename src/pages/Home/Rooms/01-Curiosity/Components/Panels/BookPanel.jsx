import React from 'react'

export default function BookPanel() {
  return (
    <div className="folder-grid">
      <div className="folder-col-left">
        <div className="folder-header-title">
          <h1>01 / ACCOUNTING BOOKS</h1>
          <h2>The Road I Almost Took</h2>
        </div>

        <p className="folder-desc" style={{ whiteSpace: 'pre-line' }}>
          {"I was told I should become an accountant. So I studied it. I learned it.\n\nWanted stability. Numbers made sense. Thought it was the responsible choice.\n\nThen... AI completely changed how I viewed that career.\n\nLooking back, I remember sitting in college classrooms, staring at balance sheets and ledger entries. The double-entry bookkeeping system felt like a rigid, logical puzzle. It was reassuring in its predictability: assets must always equal liabilities plus equity. There was a clear right and wrong answer, which felt safe in a chaotic world.\n\nBut security came at a cost. The day-to-day reality of reconciling bank statements, preparing tax returns, and auditing financial reports lacked a spark of creation. You weren't building anything new; you were merely documenting what had already happened. When generative AI and advanced automation models began writing formulaic spreadsheets and coding accounts in seconds, the illusion of safety cracked. I realized that the stable road was rapidly changing, and I didn't want to spend my life doing work that could be automated by a simple script.\n\nThose heavy accounting books still sit on my shelf today. They serve as a powerful physical reminder of a different trajectory. They represent a version of me that prioritized comfort over curiosity. I keep them not because I regret the time spent, but because they remind me that changing direction isn't a failure—it's a conscious choice of growth. Every line of code I write now has its root in the realization that I wanted to create tools, not just log their transactions."}
        </p>

        <div className="folder-lesson-box">
          <span className="folder-lesson-tag">🔑 What I Learned</span>
          <p className="folder-lesson-text">Sometimes the "safe" career isn't the right one. Changing direction isn't failure—it's growth.</p>
        </div>
      </div>

      <div className="folder-col-right">
        <div className="folder-media-container">
          <img src="/accounting_stack.png" alt="Accounting books stack" className="folder-media-img" />
          <div className="folder-media-caption">Historical Ledger stack sitting in storage.</div>
        </div>
      </div>
    </div>
  )
}
