import { Suspense, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ScrollControls, useScroll } from '@react-three/drei'
import WatchModel from './components/Mainwatchfileforthelab'
import Background from './components/Background'
import Overlay from './components/Overlay'

// Helper to sync scroll progress
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
      
      {/* 1. TEXT LAYER (Now using the CSS class) */}
      <div className="overlay-container">
         <Overlay progress={progress} />
      </div>

      {/* 2. 3D SCENE */}
      <Canvas 
        shadows 
        // Camera z=12 is usually safe for scale=10 objects
        camera={{ position: [0, 0, 12], fov: 30 }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      >
        <Suspense fallback={null}>
          <Background />
          <Environment preset="city" />
          
          <ScrollControls pages={8} damping={.04} infinite={false}>
            {/* If the watch is missing, it might be too small or too big.
                Try scale={10} first. If invisible, try scale={1}. */}
            <WatchModel scale={30} position={[5, -1, -5]}/>
            <ScrollHandler setProgress={setProgress} />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  )
}