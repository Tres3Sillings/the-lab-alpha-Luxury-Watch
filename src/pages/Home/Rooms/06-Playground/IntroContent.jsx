import React from 'react'

export default function IntroContent({ onBegin }) {
  return (
    <div className="rp-intro-content">
      <div className="rp-chapter-tag">CHAPTER 06</div>
      <h1>PLAYGROUND</h1>
      <h2>Everything I'm building today.</h2>
      <p>
        This room is your brain.
        {"\n\n"}
        Nothing is assigned.
        {"\n"}
        Everything exists because you wanted to learn.
        {"\n\n"}
        This chapter never really ends.
      </p>
      <button className="rp-begin-btn" onClick={onBegin}>
        ENTER CHAPTER 06
      </button>
    </div>
  )
}
