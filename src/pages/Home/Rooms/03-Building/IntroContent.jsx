import React from 'react'

export default function IntroContent({ onBegin }) {
  return (
    <div className="rp-intro-content">
      <div className="rp-chapter-tag">CHAPTER 03</div>
      <h1>BUILDING</h1>
      <h2>I realized what I actually loved.</h2>
      <p>
        Running businesses wasn't your favorite part.
        {"\n"}
        Starting them was.
        {"\n\n"}
        You love creating, launching, designing, and solving problems.
        {"\n\n"}
        This is where your identity forms.
      </p>
      <button className="rp-begin-btn" onClick={onBegin}>
        ENTER CHAPTER 03
      </button>
    </div>
  )
}
