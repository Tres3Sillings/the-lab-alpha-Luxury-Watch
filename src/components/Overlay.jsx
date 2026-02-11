import React from 'react'

export default function Overlay({ progress }) {
  // Checkpoints for the text based on normalized scroll progress (0.0 to 1.0)
  const sections = [
    { 
      id: 'sapphire', 
      title: 'Sapphire Crystal', 
      text: 'Ultra-tough protection.',
      visible: progress > 0.1 && progress < 0.4, // Adjusted for the new zoom phase
      align: 'right'
    },
    { 
      id: 'dial', 
      title: 'Skeleton Dial', 
      text: 'Precision engineering.',
      visible: progress > 0.4 && progress < 0.7,
      align: 'right'
    },
    { 
      id: 'mech', 
      title: 'Caliber 82S7', 
      text: '42-hour power reserve.',
      visible: progress > 0.7,
      align: 'center'
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
      {sections.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            top: '50%',
            // Alignment logic
            left: s.align === 'left' ? '10%' : s.align === 'right' ? 'auto' : '50%',
            right: s.align === 'right' ? '10%' : 'auto',
            
            // Unified Transform: Handles both centering and the entrance animation
            transform: `translate(${s.align === 'center' ? '-50%' : '0'}, -50%) 
                        ${s.visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)'}`,
            
            opacity: s.visible ? 1 : 0,
            filter: s.visible ? 'blur(0px)' : 'blur(10px)',
            transition: 'all 0.4s ease-out', // Snappy transition for fast scrolling
            textAlign: s.align,
          }}
        >
          <h1 style={{ 
            color: 'white', 
            fontSize: '5vw', 
            margin: 0, 
            textTransform: 'uppercase',
            lineHeight: 1,
            textShadow: '0 10px 30px rgba(0,0,0,0.5)' 
          }}>
            {s.title}
          </h1>
          <p style={{ 
            color: '#aaa', 
            fontSize: '1.5vw', 
            marginTop: '10px',
            fontWeight: '300' 
          }}>
            {s.text}
          </p>
        </div>
      ))}

      {/* FIXED BRANDING */}
      <div style={{ 
        position: 'absolute', 
        top: 40, 
        left: 40, 
        color: 'white', 
        letterSpacing: '2px',
        fontWeight: 'bold', 
        pointerEvents: 'all' 
      }}>
        THE LAB / ALPHA
      </div>
    </div>
  )
}