import React from 'react'

export default function IntroContent({ onBegin }) {
  return (
    <div className="rp-intro-content">
      <div className="rp-chapter-tag">CHAPTER 07</div>
      <h1>THE FUTURE</h1>
      <h2>I'm just getting started.</h2>
      <p>
        No grand ending.
        {"\n"}
        No "I've made it."
        {"\n"}
        Just possibility.
        {"\n\n"}
        The best project is always the next one.
        {"\n\n"}
        What's next?
      </p>
      <button className="rp-begin-btn" onClick={onBegin}>
        ENTER CHAPTER 07
      </button>
    </div>
  )
}
