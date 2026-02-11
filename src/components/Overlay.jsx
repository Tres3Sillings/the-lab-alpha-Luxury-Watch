import { useScroll, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useState } from 'react'

const Section = (props) => {
  return (
    <section 
      style={{
        // FIXED: This forces the text to ignore scrolling and stay on screen
        position: 'fixed', 
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: props.align === 'right' ? 'flex-end' : props.align === 'left' ? 'flex-start' : 'center',
        padding: '5vw',
        pointerEvents: 'none',
        // Opacity Logic
        opacity: props.visible ? 1 : 0,
        // Slide animation
        transform: props.visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}
    >
      <div style={{ pointerEvents: 'none' }}>
        {props.children}
      </div>
    </section>
  )
}

export default function Overlay() {
  const scroll = useScroll()
  const [phase, setPhase] = useState(0)

  useFrame(() => {
    // Monitor scroll position (0 to 1)
    const val = scroll.offset
    
    // Define the "Scenes"
    // 0 = Intro, 1 = Sapphire, 2 = Dial, 3 = Movement
    if (val < 0.15) setPhase(0)
    else if (val >= 0.15 && val < 0.40) setPhase(1)
    else if (val >= 0.40 && val < 0.65) setPhase(2)
    else if (val >= 0.65) setPhase(3)
  })

  return (
    // <Html fullscreen> is great, but we add 'fixed' inside Section just to be safe.
    <Html fullscreen style={{ pointerEvents: 'none' }}>
      
      {/* PHASE 1: SAPPHIRE CRYSTAL (Right) */}
      <Section visible={phase === 1} align="right">
        <h1 style={{ 
            color: 'white', fontSize: '4rem', fontWeight: '800', 
            textTransform: 'uppercase', textAlign: 'right', margin: 0,
            textShadow: '0 5px 15px rgba(0,0,0,0.5)'
        }}>
          Sapphire<br/>Crystal
        </h1>
        <div style={{ height: '4px', width: '100px', background: 'white', margin: '10px 0 10px auto' }}></div>
        <p style={{ color: '#ccc', fontSize: '1.2rem', textAlign: 'right', maxWidth: '300px', fontFamily: 'sans-serif' }}>
          Scratch-resistant synthetic sapphire with anti-reflective coating.
        </p>
      </Section>

      {/* PHASE 2: SKELETON DIAL (Left) */}
      <Section visible={phase === 2} align="left">
        <h1 style={{ 
            color: 'white', fontSize: '4rem', fontWeight: '800', 
            textTransform: 'uppercase', margin: 0,
            textShadow: '0 5px 15px rgba(0,0,0,0.5)'
        }}>
          Skeleton<br/>Dial
        </h1>
        <div style={{ height: '4px', width: '100px', background: 'white', margin: '10px auto 10px 0' }}></div>
        <p style={{ color: '#ccc', fontSize: '1.2rem', maxWidth: '300px', fontFamily: 'sans-serif' }}>
          Intricate open-work design showcasing the inner mechanics.
        </p>
      </Section>

      {/* PHASE 3: MOVEMENT (Center Bottom) */}
      <Section visible={phase === 3} align="center">
        <div style={{ marginTop: '50vh' }}> {/* Push text to bottom of screen */}
            <h1 style={{ 
                color: 'white', fontSize: '4rem', fontWeight: '800', 
                textTransform: 'uppercase', textAlign: 'center', margin: 0,
                textShadow: '0 5px 15px rgba(0,0,0,0.5)'
            }}>
            Caliber 82S7
            </h1>
            <div style={{ height: '4px', width: '100px', background: 'white', margin: '10px auto' }}></div>
            <p style={{ color: '#ccc', fontSize: '1.2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
            Automatic movement with 42-hour power reserve.
            </p>
        </div>
      </Section>

    </Html>
  )
}