import React from 'react'

export default function IntroContent({ onBegin }) {
  return (
    <div className="intro-content">
      <h1>TRES SILLINGS</h1>
      <h2>Creative Developer & 3D Web Designer</h2>
      <p>
        Welcome to my interactive 3D portfolio. I specialize in building immersive web applications, highly performant Three.js configuration workbenches, and rich frontend systems.
        {"\n\n"}
        Explore the room. Click on objects in the desk space to examine my skills, project case studies, and creative milestones.
      </p>
      <button className="begin-btn" onClick={onBegin}>
        BEGIN EXPERIENCE
      </button>
    </div>
  )
}
