import React from 'react'

export default function IntroContent({ onBegin }) {
  return (
    <div className="rp-intro-content">
      <div className="rp-chapter-tag">CHAPTER 04</div>
      <h1>FREELANCE</h1>
      <h2>Helping other people build.</h2>
      <p>
        After building your own projects, you realized
        {"\n"}
        helping others succeed was just as rewarding.
        {"\n\n"}
        Churches. Friends. Businesses. Real estate.
        {"\n"}
        Restaurants. Contractors.
        {"\n\n"}
        You became someone who solves problems.
      </p>
      <button className="rp-begin-btn" onClick={onBegin}>
        ENTER CHAPTER 04
      </button>
    </div>
  )
}
