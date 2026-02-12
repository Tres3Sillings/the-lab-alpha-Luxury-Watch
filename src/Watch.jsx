import { Suspense, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ScrollControls, useScroll, useProgress } from '@react-three/drei' // 1. Import useProgress
import WatchModel from './components/Mainwatchfileforthelab'
import Background from './components/Background'
import Overlay from './components/Overlay'

// 2. Create a dedicated Loader Component
function CustomLoader() {
  const { active, progress } = useProgress() // This hook detects if 3D assets are loading
  
  // While active is true (loading), show the HTML. 
  // When false (loaded), return null (disappear).
  if (!active) return null

  return (
    <div className="loader-watch-container">
      <div className="clock-face">
        <div className="clock-hand"></div>
        {/* Optional: Show percentage */}
        <div className="clock-center"></div>
      </div>
      <p style={{position: 'absolute', top: '60%', color: 'white', fontFamily: 'Space Mono'}}>
        {Math.floor(progress)}%
      </p>
    </div>
  )
}

function ScrollHandler({ setProgress }) {
  const scroll = useScroll()
  useFrame(() => {
    setProgress(scroll.offset)
  })
  return null
}

export default function Watch() {
  const [progress, setProgress] = useState(0)

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      
      {/* 3. Drop the Loader here (OUTSIDE the Canvas) */}
      <CustomLoader />

      <div className="overlay-container">
         <Overlay progress={progress} />
      </div>

      <Canvas 
        shadows 
        camera={{ position: [0, 0, 12], fov: 30 }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      >
        <Suspense fallback={null}>
          <Background />
          <Environment preset="city" />
          
          <ScrollControls pages={8} damping={.04} infinite={false}>
            <WatchModel scale={30} position={[5, -1, -5]}/>
            <ScrollHandler setProgress={setProgress} />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  )
}