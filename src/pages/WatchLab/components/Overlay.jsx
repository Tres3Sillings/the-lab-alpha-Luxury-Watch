import React from 'react'
import { Link } from 'react-router-dom'

export default function Overlay({ progress }) {
  // 1. HERO SECTION: Visible only at the very start (0 to 5% scroll)
  const heroVisible = progress < 0.05;

  // 2. SPACED SECTIONS: Each occupies a 15% window with gaps in between
  const sections = [
    { 
      id: 'sapphire', 
      title: 'Sapphire Crystal', 
      text: 'Ultra-tough protection.',
      visible: progress > 0.10 && progress < 0.25, // 15% window
      align: 'right'
    },
    { 
      id: 'dial', 
      title: 'Skeleton Dial', 
      text: 'Precision engineering.',
      visible: progress > 0.40 && progress < 0.55, // 15% window
      align: 'right'
    },
    { 
      id: 'mech', 
      title: 'Caliber 82S7', 
      text: '42-hour power reserve.',
      visible: progress > 0.70 && progress < 0.85, // 15% window
      align: 'left'
    },
    {
        id: 'conclusion',
        title: 'Time Redefined',
        text: 'Experience the fusion of design and precision.',
        align: 'center',
        visible: progress > 0.95
    }
  ]
  

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 10,
      pointerEvents: 'none',
      fontFamily: "'Helvetica Neue', Arial, sans-serif"
    }}>
      
      {/* --- HERO SECTION --- */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: heroVisible ? 1 : 0,
        transform: `translateY(${heroVisible ? '0' : '-20px'})`,
        transition: 'all 0.6s ease-out',
        textAlign: 'center'
      }}>
        <h1 style={{ color: 'white', fontSize: '8vw', margin: 0, textTransform: 'uppercase' }}>
          The Lab Alpha
        </h1>
        <p style={{ color: '#aaa', fontSize: '1.5vw', letterSpacing: '4px' }}>
          TIME DEFINED BY DESIGN
        </p>
        
        {/* BUY NOW CTA */}
        <button style={{
          marginTop: '40px',
          padding: '15px 40px',
          background: 'white',
          border: 'none',
          borderRadius: '50px',
          fontSize: '1vw',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          cursor: 'pointer',
          pointerEvents: heroVisible ? 'all' : 'none',
          letterSpacing: '2px',
          color: '#000',
        }}>
          Buy Now
        </button>

        {/* SCROLL PROMPT */}
        <div style={{
          position: 'absolute',
          bottom: '50px',
          color: 'white',
          fontSize: '0.8vw',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          animation: 'bounce 2s infinite'
        }}>
          ↓ Scroll to Explore
        </div>
      </div>

      {/* --- FEATURE SECTIONS (With Gaps) --- */}
      {sections.map((s) => (
  <div
    key={s.id}
    style={{
      position: 'absolute',
      top: '50%',
      left: s.align === 'left' ? '10%' : s.align === 'right' ? 'auto' : '50%',
      right: s.align === 'right' ? '10%' : 'auto',
      transform: `translate(${s.align === 'center' ? '-50%' : '0'}, -50%) 
                  ${s.visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)'}`,
      opacity: s.visible ? 1 : 0,
      filter: s.visible ? 'blur(0px)' : 'blur(10px)',
      transition: 'all 0.4s ease-out',
      textAlign: s.align,
    }}
  >
    <h1 style={{ color: 'white', fontSize: '5vw', margin: 0, textTransform: 'uppercase' }}>
      {s.title}
    </h1>
    <p style={{ color: '#aaa', fontSize: '1.5vw', marginTop: '10px' }}>
      {s.text}
    </p>

    {/* RENDER BUY BUTTON ONLY FOR CONCLUSION */}
    {s.id === 'conclusion' && (
      <button
        onClick={() => window.alert("Redirecting to shop...")}
        style={{
          marginTop: '30px',
          padding: '15px 40px',
          backgroundColor: '#fff',
          color: '#000',
          border: 'none',
          borderRadius: '50px',
          fontSize: '1vw',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          cursor: 'pointer',
          pointerEvents: s.visible ? 'all' : 'none', // Critical for interactivity
          transition: 'transform 0.2s active',
        }}
      >
        Buy Now
      </button>
    )}
  </div>
))}

      {/* FIXED BRANDING */}
<Link 
  to="/home" 
  state={{ from: 'watch' }}
  className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
  style={{ 
    position: 'absolute', // Ensure it's positioned
    top: '32px',          // 8 * 4px (tailwind 'top-8')
    left: '32px',         // 8 * 4px (tailwind 'left-8')
    pointerEvents: 'auto', // 👈 THIS IS THE FIX
    zIndex: 20            // Ensure it sits above everything else
  }}
>
  ← THE LAB / ALPHA
</Link>
    </div>
  )
}
