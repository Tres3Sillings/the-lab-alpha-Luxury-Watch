import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import Experience from './components/Home/Experience'
import Interface from './components/Home/Interface'

export default function Home() {
  const [activeProject, setActiveProject] = useState(null)
  const [isStarted, setIsStarted] = useState(false)
  
  // MASTER ROTATION STATE (Lifted Up)
  const [rotationY, setRotationY] = useState(-0.085) // Calibrated to match the first slot (Nike Lab)

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'relative' }}>
      
      {/* 1. UI OVERLAY */}
      <Interface 
        isStarted={isStarted} 
        onStart={() => setIsStarted(true)} 
        activeProject={activeProject} 
        onBack={() => setActiveProject(null)}
        rotationY={rotationY}
        setRotationY={setRotationY}
      />

      {/* 2. 3D SCENE */}
      <Canvas 
        shadows 
        camera={{ position: [-0.92, 18.96, 0.05], fov: 80 }} // Starting High
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