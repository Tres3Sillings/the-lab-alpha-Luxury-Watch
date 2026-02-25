import React, { useState, Suspense, useEffect } from 'react' // Added useEffect
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { useLocation } from 'react-router-dom' // <--- IMPORT THIS
import * as THREE from 'three'
import Experience from './components/Home/Experience'
import Interface from './components/Home/Interface'
import Loader from './components/Home/Loader'

export default function Home() {
  const location = useLocation() // <--- ACCESS THE ROUTER STATE

  // --- CONFIGURATION ---
  // These must match your SLOTS in Interface.jsx
  const ROTATION_SHOE = -0.05
  const ROTATION_WATCH = 0.67

  // --- SMART INITIALIZATION ---
  // Check the "secret note" immediately to set the starting state
  const getInitialState = () => {
    const from = location.state?.from
    if (from === 'watch') return { rot: ROTATION_WATCH, started: true }
    if (from === 'shoe')  return { rot: ROTATION_SHOE,  started: true }
    return { rot: -0.05, started: false } // Default start
  }

  const initialState = getInitialState()

  const [activeProject, setActiveProject] = useState(null)
  const [isStarted, setIsStarted] = useState(initialState.started)
  const [rotationY, setRotationY] = useState(initialState.rot)

  // Clear the history state so if they refresh, it doesn't get stuck
  useEffect(() => {
    if (location.state) {
      window.history.replaceState({}, document.title)
    }
  }, [location])

  // ... (keep imports and state logic)

  return (
    <div style={{ width: '100vw', height: '100dvh', background: '#050505', position: 'relative', overflow: 'hidden' }}>

      <Loader />
      
      <Interface 
        isStarted={isStarted} 
        onStart={() => setIsStarted(true)} 
        activeProject={activeProject} 
        onBack={() => setActiveProject(null)}
        rotationY={rotationY}
        setRotationY={setRotationY}
      />

      <Canvas 
        shadows 
        // FIX: Always start at Intro position so the Rig can animate the transition
        camera={{ 
          position: [-0.92, 18.96, 0.05], 
          fov: 80 
        }} 
        gl={{ toneMapping: THREE.AgXToneMapping, toneMappingExposure: 0.6 }}
        onPointerMissed={() => console.log("⚠️ Clicked Background")}
      >
        <Suspense fallback={null}>
          <Experience 
            isStarted={isStarted} 
            activeProject={activeProject} 
            rotationY={rotationY}
            setRotationY={setRotationY}
            onProjectSelect={setActiveProject}
          />
          <Environment preset="city" />
          <ContactShadows opacity={0.4} scale={20} blur={2.4} />
        </Suspense>
      </Canvas>
    </div>
  )
}