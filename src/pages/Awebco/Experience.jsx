import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Float, Stars, Environment } from '@react-three/drei'
import * as THREE from 'three'
import './components/Awebco.css'

import RocketAwebco from './components/RocketAwebco'
import EnvironmentAwebco from './components/EnviromentAwebco'
import Overlay from './components/Overlay'

const showAsteroids = true;

export const PROJECTS = [
  { id: 'atlas', url: 'https://atlastotalhome.com/', start: 0.30, mobile: 0.40, end: 0.48 },
  { id: 'sentry', url: 'https://sentryroofing.com/', start: 0.50, mobile: 0.60, end: 0.68 }, 
  { id: 'fetch', url: 'https://www.sabrebats.com/', start: 0.70, mobile: 0.80, end: 0.88 }, 
]

function LaunchSmoke() {
  const smokeRef = useRef()
  const scroll = useScroll()
  const particles = useMemo(() => Array.from({ length: 40 }, () => ({
    x: (Math.random() - 0.5) * 2.5,
    z: (Math.random() - 0.5) * 2.5,
    scale: Math.random() * 1.5 + 0.5,
    speed: Math.random() * 0.04
  })), [])

  useFrame(() => {
    const offset = scroll.offset
    if (smokeRef.current) {
      const visibility = THREE.MathUtils.smoothstep(offset, 0.01, 0.15) - THREE.MathUtils.smoothstep(offset, 0.25, 0.45)
      smokeRef.current.children.forEach((puff, i) => {
        if (offset < 0.01) puff.position.set(particles[i].x, 0, particles[i].z)
        puff.position.y += particles[i].speed * (1 + offset * 15)
        puff.scale.setScalar(particles[i].scale * (1 + offset * 10))
        puff.material.opacity = visibility * 0.6
      })
    }
  })

  return (
    <group ref={smokeRef} position={[0, 0.2, 0]} rotation={[-Math.PI / 1, 0, 0]}>
      {particles.map((p, i) => (
        <mesh key={i}>
          <sphereGeometry args={[.8, 16, 16]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function AsteroidField() {
  const data = useMemo(() => Array.from({ length: 60 }, () => ({
    pos: [(Math.random() - 0.5) * 80, (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 30 - 30],
    scale: Math.random() * 0.6 + 0.1,
    rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0]
  })), [])

  return data.map((d, i) => (
    <mesh key={i} position={d.pos} scale={d.scale} rotation={d.rot}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#333" roughness={1} />
    </mesh>
  ))
}

function Scene() {
  const scroll = useScroll()
  const rocketWrapperRef = useRef()

  const PLATFORM_WIDTH = 17.8; 

useFrame((state) => {
    const offset = scroll.offset

    // --- 1. CAROUSEL / SITE REVEAL LOGIC ---
    PROJECTS.forEach((proj) => {
      const portal = document.getElementById(`portal-${proj.id}`)
      if (portal) {
        const isActive = offset >= proj.start && offset <= proj.end
        portal.style.opacity = isActive ? 1 : 0
        portal.style.pointerEvents = isActive ? 'all' : 'none'
        portal.style.left = isActive ? '50%' : (offset > proj.end ? '-50%' : '150%')
      }
    })

    // --- 2. THE MASTER BELL CURVE (0 -> 1 -> 0) ---
    // This value gracefully arcs up as the rocket launches (offset 0.05 to 0.20)
    // and returns perfectly to 0 as the UI slides in (offset 0.20 to 0.30).
    const launchPhase = THREE.MathUtils.smoothstep(offset, 0.05, 0.20)
    const returnPhase = THREE.MathUtils.smoothstep(offset, 0.20, 0.30)
    const cinematicCurve = launchPhase - returnPhase 

    // --- 3. CAMERA POSITION (RUBBER BAND EFFECT) ---
    // Start at Blender defaults. At peak launch (cinematicCurve = 1), 
    // pull back +6 on X and drop -1.6 on Y for a cinematic low-angle shot.
    // It returns exactly to 9.06, 2.16, 0.08 when cinematicCurve goes back to 0.
    state.camera.position.x = 9.06 + (cinematicCurve * 6)
    state.camera.position.y = 2.16 - (cinematicCurve * 1.6)
    state.camera.position.z = 0.08

    // --- 4. ROCKET LIFTOFF ---
    if (rocketWrapperRef.current) {
      // The rocket does NOT return. It flies up to 150 and stays gone.
      const lift = THREE.MathUtils.smoothstep(offset, 0.05, 0.3) * 150 
      rocketWrapperRef.current.position.y = lift
    }

    // --- 5. CAMERA PAN (LOOK-AT) ---
    // Tracks the rocket up to Y=60, then smoothly pans the neck right back 
    // down to Y=0 (your original focal point) to match the starting view.
    state.camera.lookAt(0, cinematicCurve * 60, 0)
  })

  return (
    <>
      {/* 3x Looped Environment */}
      <EnvironmentAwebco position={[0, 0, 0]} scale={1} />
      <EnvironmentAwebco position={[0, 0, -PLATFORM_WIDTH]} scale={1} />
      <EnvironmentAwebco position={[0, 0, PLATFORM_WIDTH]} scale={1} />

      <LaunchSmoke />
      {/* showAsteroids && <AsteroidField /> */}

      <group ref={rocketWrapperRef}>
        <Float speed={scroll.offset > 0.2 ? 5 : 1} rotationIntensity={0.5} floatIntensity={0.5}>
          <RocketAwebco scale={1} position={[0, 0, 0]} />
        </Float>
      </group>

      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
    </>
  )
}

export default function Experience() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden', 
      backgroundColor: '#000',
      // --- BACKGROUND SET HERE ---
      backgroundImage: 'url(/BackdropAwebco.png)', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      
      {PROJECTS.map((proj) => (
        <div key={proj.id} id={`portal-${proj.id}`} className="project-portal">
          <iframe 
            src={proj.url} 
            title={`${proj.id} Project View`}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      ))}

      {/* Canvas is transparent by default, so the CSS background will show through */}
    <Canvas 
  shadows={false} 
  camera={{ 
    position: [9.06, 2.16, 0.08], 
    fov: 40 // The 50mm equivalent
  }}
>
        <Suspense fallback={null}>
          <ScrollControls pages={8} damping={0.2}>
            <Scene />
            <Scroll html style={{ width: '100%', height: '100%' }}>
              <Overlay />
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  )
}