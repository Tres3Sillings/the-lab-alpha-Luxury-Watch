import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Float, Stars, Environment } from '@react-three/drei'
import * as THREE from 'three'
import './components/Awebco.css'

import Rocket from './components/Rocket'
import Overlay from './components/Overlay'

const showAsteroids = true;

// 1. ADD THE 'mobile' TRIGGER TO THE CONFIG ARRAY
export const PROJECTS = [
  // Desktop starts at 0.30, shrinks to mobile at 0.40, leaves at 0.48
  { id: 'atlas', url: 'https://atlastotalhome.com/', start: 0.30, mobile: 0.40, end: 0.48 },
  // Desktop starts at 0.50, shrinks to mobile at 0.60, leaves at 0.68
  { id: 'sentry', url: 'https://sentryroofing.com/', start: 0.50, mobile: 0.60, end: 0.68 }, 
  // Desktop starts at 0.70, shrinks to mobile at 0.80, leaves at 0.88
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
    <group ref={smokeRef} position={[0, -3.2, 0]}>
      {particles.map((p, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 16, 16]} />
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
  const rocketRef = useRef()

  useFrame((state) => {
    const offset = scroll.offset

    // --- CAROUSEL & MOBILE SLIDE LOGIC ---
    PROJECTS.forEach((proj) => {
      const portal = document.getElementById(`portal-${proj.id}`)
      if (portal) {
        const isActive = offset >= proj.start && offset <= proj.end
        // Check if we have passed the mobile trigger point for THIS specific project
        const isMobile = offset >= proj.mobile && offset <= proj.end

        portal.style.opacity = isActive ? 1 : 0
        portal.style.pointerEvents = isActive ? 'all' : 'none'
        
        let slidePos = '150%' 
        if (isActive) slidePos = '50%' 
        if (offset > proj.end) slidePos = '-50%' 
        
        portal.style.left = slidePos

        // Toggle the mobile class dynamically
        if (isMobile) {
          portal.classList.add('is-mobile')
        } else {
          portal.classList.remove('is-mobile')
        }
      }
    })

    const cameraDepthLock = Math.min(offset, 0.30) 

    if (rocketRef.current) {
      const lift = THREE.MathUtils.smoothstep(offset, 0.05, 0.3) * 150 
      rocketRef.current.position.y = -2 + lift
    }

    const targetY = offset < 0.2 ? (rocketRef.current?.position.y || 0) + 2 : 0
    const smoothY = THREE.MathUtils.lerp(state.camera.userData.lastY || 0, targetY, 0.05)
    state.camera.userData.lastY = smoothY
    
    state.camera.position.z = 15 + cameraDepthLock * 15
    state.camera.lookAt(0, smoothY, 0)
  })

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#000814" roughness={1} />
      </mesh>

      <LaunchSmoke />
      {showAsteroids && <AsteroidField />}

      <Float speed={scroll.offset > 0.2 ? 5 : 1}>
        <Rocket ref={rocketRef} scale={3} />
      </Float>

      <Stars radius={200} count={10000} factor={4} fade speed={1} />
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
    </>
  )
}

export default function Experience() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* MAP OUT THE 3 DOM PORTALS OUTSIDE THE CANVAS */}
      {PROJECTS.map((proj) => (
        <div key={proj.id} id={`portal-${proj.id}`} className="project-portal">
          <iframe 
            src={proj.url} 
            title={`${proj.id} Project View`}
          />
        </div>
      ))}

      <Canvas shadows camera={{ position: [0, 0, 15], fov: 35 }}>
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