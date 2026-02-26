import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Float, Stars, Environment } from '@react-three/drei'
import * as THREE from 'three'

import Rocket from './components/Rocket'
import Planet_01 from './components/Planet_01'
import Overlay from './components/Overlay'

const CONFIG = {
  rocket: {
    position: [0, -1.2, -5], // Relative to camera rig
    scale: 1,
    floatIntensity: 0.5, 
    rotationIntensity: 0.2 
  },
  destinations: [
    { id: "SABREBATS", entry: 0.15, exit: 0.45, startX: -25, endX: -8, yPos: -26 },
    { id: "ATLAS", entry: 0.40, exit: 0.60, startX: 20, endX: 8, yPos: -50 },
    { id: "SENTRY", entry: 0.65, exit: 1, startX: -20, endX: -8, yPos: -75 }
  ]
}

function Scene() {
  const scroll = useScroll()
  const rigRef = useRef() 
  const p1 = useRef(); const p2 = useRef(); const p3 = useRef();

  useFrame((state, delta) => {
    const offset = scroll.offset
    
    // 1. VERTICAL FLIGHT: Move camera Y down so world appears to move UP
    const targetY = -offset * 100 
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.1)
    
    if (rigRef.current) {
      // Lock the rig (rocket) to the camera's Y position
      rigRef.current.position.y = state.camera.position.y
    }

    // 2. PLANET SLIDE LOGIC (Horizontal slide while flying vertically)
    const animatePlanet = (ref, config) => {
      if (ref.current) {
        const entryProg = THREE.MathUtils.smoothstep(offset, config.entry, config.entry + 0.1)
        const exitProg = THREE.MathUtils.smoothstep(offset, config.exit, config.exit + 0.1)
        const currentX = THREE.MathUtils.lerp(config.startX, config.endX, entryProg - exitProg)
        
        // Planet stays at a fixed Y in the world, camera flies past it
        ref.current.position.x = currentX
        ref.current.rotation.y += delta * 0.3
      }
    }

    animatePlanet(p1, CONFIG.destinations[0]);
    animatePlanet(p2, CONFIG.destinations[1]);
    animatePlanet(p3, CONFIG.destinations[2]);
  })

  return (
    <>
      <group ref={rigRef}>
        <Float speed={1.5} rotationIntensity={CONFIG.rocket.rotationIntensity} floatIntensity={CONFIG.rocket.floatIntensity}> 
          <Rocket scale={CONFIG.rocket.scale} position={CONFIG.rocket.position} />
        </Float>
      </group>

      {/* Planets positioned at different Y heights to "fly past" */}
      <Planet_01 ref={p1} position={[0, CONFIG.destinations[0].yPos, -15]} scale={5} />
      <Planet_01 ref={p2} position={[0, CONFIG.destinations[1].yPos, -15]} scale={5} />
      <Planet_01 ref={p3} position={[0, CONFIG.destinations[2].yPos, -15]} scale={5} />

      <Stars radius={100} depth={100} count={7000} factor={4} saturation={0} fade speed={2} />
    </>
  )
}

export default function Experience() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000814' }}>
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 35 }}>
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <ScrollControls pages={5} damping={0.2}>
            <Scene />
            <Scroll html>
              <Overlay />
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  )
}