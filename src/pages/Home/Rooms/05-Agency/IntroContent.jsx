import React from 'react'

export default function IntroContent({ onBegin }) {
  return (
    <div className="rp-intro-content">
      <div className="rp-chapter-tag">CHAPTER 05</div>
      <h1>AGENCY</h1>
      <h2>Learning from professionals.</h2>
      <p>
        Freelancing taught you how to build.
        {"\n"}
        Agency life taught you how teams build.
        {"\n\n"}
        Deadlines. Systems. Large projects.
        {"\n"}
        Professional workflows. Code quality.
        {"\n"}
        Accessibility. Production.
      </p>
      <button className="rp-begin-btn" onClick={onBegin}>
        ENTER CHAPTER 05
      </button>
    </div>
  )
}
