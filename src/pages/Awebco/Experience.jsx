import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Float, Stars, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Importing your generated components
import Rocket from './components/Rocket'
import Planet_01 from './components/Planet_01'
import Asteroid from './components/Asteroid'
import Overlay from './components/Overlay'

function Scene() {
  const scroll = useScroll()
  const rocketRef = useRef()
  const groupRef = useRef()

  // 1. Create a randomized asteroid field based on your "In Transit" sketch
  const asteroids = useMemo(() => {
    return Array.from({ length: 25 }, () => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 50 - 10 // Spread them along the Z-axis
      ],
      scale: Math.random() * 0.4 + 0.1,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      speed: Math.random() * 0.01 // Individual spin speed
    }))
  }, [])

 useFrame((state, delta) => {
  const offset = scroll.offset // 0 to 1 scroll progress

  // --- LANDING LOGIC (0.0 to 0.4 scroll) ---
  // We want the rocket to be "landed" by the time we hit 30% scroll
  const landProg = Math.min(offset * 3.33, 1) 

  if (rocketRef.current) {
    // 1. Position: Move from center [0,0,0] to Planet surface [5,-2,-15]
    // Values adjusted to match your Planet_01 position
    rocketRef.current.position.x = THREE.MathUtils.lerp(0, 4.5, landProg)
    rocketRef.current.position.y = THREE.MathUtils.lerp(0, -1.2, landProg)
    rocketRef.current.position.z = THREE.MathUtils.lerp(0, -13.8, landProg)

    // 2. Rotation: Tilt the rocket to "sit" on the sphere's curve
    rocketRef.current.rotation.x = THREE.MathUtils.lerp(0, -Math.PI / 6, landProg)
    
    // --- TRANSITION LOGIC (0.4 to 0.7 scroll) ---
    // The "Quantum Jump" turn from your sketch
    const jumpProg = Math.max(0, (offset - 0.4) * 5)
    const targetJumpRotation = offset > 0.4 ? Math.PI / 2 : 0
    rocketRef.current.rotation.y = THREE.MathUtils.lerp(rocketRef.current.rotation.y, targetJumpRotation, 0.1)
  }

  // 3. Camera Follow: Keep the rocket in view
  state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 10 - offset * 50, 0.1)
})

  return (
    <group ref={groupRef}>
      {/* The Hero Rocket - Fixed relative to camera view */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Rocket ref={rocketRef} scale={0.5} position={[0, -1, 0]} />
      </Float>

      {/* Destination 1: The Tech-Camo Planet (Build) */}
      <Planet_01 position={[5, -2, -15]} scale={2.5} />

      {/* The Asteroid Field */}
      {asteroids.map((props, i) => (
        <Asteroid key={i} {...props} />
      ))}

      {/* Global Environment */}
      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
    </group>
  )
}

export default function Experience() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000814' }}>
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 35 }}>
        {/* AWEBCO Brand Lighting: Navy and White with Red Accents */}
        <color attach="background" args={['#000814']} />
        <Environment preset="city" />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#E9F4FF" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#CC3333" />

        <Suspense fallback={null}>
          <ScrollControls pages={4} damping={0.2}>
            <Scene />
            
            {/* 2D UI Layer for project titles and buttons */}
            <Scroll html>
              <Overlay />
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  )
}