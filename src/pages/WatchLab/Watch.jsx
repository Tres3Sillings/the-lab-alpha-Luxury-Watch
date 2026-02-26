import { Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ScrollControls, useScroll, useProgress } from '@react-three/drei'
import WatchModel from './components/Mainwatchfileforthelab'
import Background from './components/Background'
import Overlay from './components/Overlay'

// --- 1. LOADER COMPONENT ---
function CustomLoader() {
  const { active, progress } = useProgress()
  if (!active) return null

  return (
    <div className="loader-watch-container">
      <div className="clock-face">
        <div className="clock-hand"></div>
        <div className="clock-center"></div>
      </div>
      <p style={{position: 'absolute', top: '60%', color: 'white', fontFamily: 'Space Mono'}}>
        {Math.floor(progress)}%
      </p>
    </div>
  )
}

// --- 2. SCROLL HANDLER ---
function ScrollHandler({ setProgress }) {
  const scroll = useScroll()
  useFrame(() => {
    setProgress(scroll.offset)
  })
  return null
}

// --- 3. MAIN COMPONENT ---
export default function Watch() {
  const [progress, setProgress] = useState(0)
  const [scale, setScale] = useState(30)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setScale(mobile ? 18 : 30) 
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100dvh', background: '#000' }}>
      
      <CustomLoader />

      <div className="overlay-container">
         <Overlay progress={progress} />
      </div>

      <Canvas 
        shadows 
        camera={{ position: [0, 0, 12], fov: isMobile ? 40 : 30 }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      >
        <Suspense fallback={null}>
          <Background />
          <Environment preset="city" />
          
          {/* MOBILE FIXES:
             1. pages: Reduced to 8 on mobile (less scrolling required)
             2. damping: Increased to 0.2 on mobile (stops "flying" / sliding on ice)
          */}
          <ScrollControls 
            pages={isMobile ? 8 : 10} 
            damping={isMobile ? 0.2 : 0.04} 
            infinite={false}
          >
            
            <WatchModel 
              scale={scale} 
              position={[5, -1, -5]} 
            />
            
            <ScrollHandler setProgress={setProgress} />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  )
}