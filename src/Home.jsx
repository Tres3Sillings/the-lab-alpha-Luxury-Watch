import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import Experience from './components/Home/Experience' // Or './components/Home/Experience' if inside Home folder
import Interface from './components/Home/Interface'

export default function Home() {
  const [activeProject, setActiveProject] = useState(null)
  const [isStarted, setIsStarted] = useState(false)

  // We DO NOT load the model here. It blocks the UI.
  // We just pass the state down to Experience.

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'relative' }}>
      
      {/* 1. UI OVERLAY (Loads Instantly now) */}
      <Interface 
        isStarted={isStarted} 
        onStart={() => setIsStarted(true)} 
        activeProject={activeProject} 
        onBack={() => setActiveProject(null)} 
      />

      {/* 2. 3D SCENE */}
      <Canvas 
        shadows 
        camera={{ position: [-0.92, 18.96, 0.05], fov: 80 }}
        gl={{ toneMapping: THREE.AgXToneMapping, toneMappingExposure: 0.6 }}
        onPointerMissed={() => console.log("⚠️ Clicked Background")}
      >
        {/* The Suspense Boundary is HERE. Only stuff inside this waits for 3D. */}
        <Suspense fallback={null}>
          <Experience 
            isStarted={isStarted} 
            activeProject={activeProject} 
            onProjectSelect={(name) => {
               console.log("🎯 TARGET CONFIRMED: " + name)
               setActiveProject(name)
            }}
          />
          <Environment preset="city" />
          <ContactShadows opacity={0.4} scale={20} blur={2.4} />
        </Suspense>
      </Canvas>
    </div>
  )
}