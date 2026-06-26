import React from 'react'

export default function IntroContent({ onBegin }) {
  return (
    <div className="intro-content">
      <h1>02 / EXPERIMENTS</h1>
      <h2>I tried everything.</h2>
      <p>
        This is where ideas became reality.
        {"\n\n"}
        Some failed. Some worked. Every project taught me something.
        {"\n\n"}
        I wasn't chasing money — I was collecting skills.
        {"\n\n"}
        Click on objects in the room to explore the workbench projects.
      </p>
      <button className="begin-btn" onClick={onBegin}>
        ENTER THE WORKSHOP
      </button>
    </div>
  )
}
