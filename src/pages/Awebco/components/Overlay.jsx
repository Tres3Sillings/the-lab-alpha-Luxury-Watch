import React from 'react'

const Section = ({ title, description, color = "#00396E" }) => (
  <section style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end', // Aligns text to the right as per your sketch
    padding: '0 10%',
    color: 'white',
    pointerEvents: 'none' // Allows clicking the 3D scene behind the text
  }}>
    <div style={{ maxWidth: '400px', textAlign: 'right', pointerEvents: 'all' }}>
      <h1 style={{ fontSize: '3.5rem', margin: 0, color }}>{title}</h1>
      <div style={{ width: '100%', height: '2px', background: color, margin: '10px 0' }} />
      <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>{description}</p>
      <button style={{
        background: '#CC3333', // AWEBCO Red
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '20px'
      }}>
        View Project
      </button>
    </div>
  </section>
)

export default function Overlay() {
  return (
    <div style={{ width: '100vw' }}>
      {/* Page 1: Hero / Intro (Desktop-1) */}
      <section style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10%' }}>
        <h1 style={{ fontSize: '5rem', color: 'white' }}>AWEBCO<br/><span style={{ fontSize: '1.5rem', opacity: 0.7 }}>Scroll to Explore</span></h1>
      </section>

      {/* Page 2: Build (Desktop-2) */}
      <Section 
        title="BUILD" 
        description="We create high-end digital foundations. Structured, scalable, and designed to last."
        color="#E9F4FF" // Light Blue from your palette
      />

      {/* Page 3: Transit / Quantum Jump (Desktop-3) */}
      <section style={{ height: '100vh' }} /> 

      {/* Page 4: Attract (Desktop-4) */}
      <Section 
        title="ATTRACT" 
        description="Marketing that pulls. We use data-driven design to capture and hold attention."
        color="#FFE6E6" // Light Red from your palette
      />
    </div>
  )
}