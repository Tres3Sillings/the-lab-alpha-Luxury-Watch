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
  
  // Mobile Detection Logic
  const [scale, setScale] = useState(30)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Desktop: 30, Mobile: 18 (Adjust this number if it's still too big)
      setScale(mobile ? 18 : 30) 
    }
    
    // Check immediately and on resize
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      
      <CustomLoader />

      <div className="overlay-container">
         <Overlay progress={progress} />
      </div>

      <Canvas 
        shadows 
        // Adjust FOV slightly for mobile to keep things framed well
        camera={{ position: [0, 0, 12], fov: isMobile ? 40 : 30 }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      >
        <Suspense fallback={null}>
          <Background />
          <Environment preset="city" />
          
          {/* FIX: Increased pages from 8 -> 10 
             This adds 2 full screen heights of "scrollable area" to the end,
             giving the final section plenty of room to settle.
          */}
          <ScrollControls pages={10} damping={0.04} infinite={false}>
            
            <WatchModel 
              scale={scale} // Dynamic Scale based on screen size
              position={[5, -1, -5]} 
            />
            
            <ScrollHandler setProgress={setProgress} />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  )
}