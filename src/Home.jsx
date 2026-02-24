import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { easing } from 'maath'

// --- 1. CONFIGURATION ---
// Define where the camera goes for each state
const CAMERA_STATES = {
  intro: [
    { pos: [-0.92, 18.96, 0.05], target: [-0.92, 0, 0.05] }, // Step 0: High up
    { pos: [0.22, 2.07, -0.05], target: [2.53, 1.29, -0.11] }, // Step 1: Eye level
  ],
  // "Zoomed In" views. Tweak 'pos' to get closer/further
  shoe: { pos: [4.5, 1.8, 2.0], target: [5.43, 1.6, 0.02] }, 
  watch: { pos: [-1.0, 1.5, 2.0], target: [-1.0, 1.0, 0] }, // Placeholder coordinates
}

// --- 2. CAMERA RIG ---
function CameraRig({ introStep, activeProject, isStarted }) {
  useFrame((state, delta) => {
    if (!isStarted) return

    // Determine where we want to be
    let targetPos, targetLook
    
    if (activeProject) {
      // If a project is clicked, use its specific config
      const cfg = CAMERA_STATES[activeProject]
      targetPos = cfg.pos
      targetLook = cfg.target
    } else {
      // Otherwise use the intro sequence
      const cfg = CAMERA_STATES.intro[introStep]
      targetPos = cfg.pos
      targetLook = cfg.target
    }

    // Smoothly move camera position
    easing.damp3(state.camera.position, targetPos, 0.4, delta)

    // Smoothly look at the target (using a dummy vector to avoid creating new objects)
    const lookAtVec = new THREE.Vector3(...targetLook)
    
    // We dampen the quaternion (rotation) for the smoothest lookAt possible
    // standard lookAt can be jerky, so we soft-update it
    const q = new THREE.Quaternion()
    q.setFromRotationMatrix(new THREE.Matrix4().lookAt(state.camera.position, lookAtVec, state.camera.up))
    easing.dampQ(state.camera.quaternion, q, 0.4, delta)
  })

  return null
}

// --- 3. THE MODEL (With Scroll Rotation & Click Logic) ---
function Model({ onProjectSelect, activeProject, ...props }) {
  const { nodes, materials } = useGLTF('/TheLabHub_V2-transformed.glb')
  const groupRef = useRef()
  const [rotation, setRotation] = useState(0)

  // Scroll Listener
  useEffect(() => {
    const handleScroll = (e) => {
      // Only rotate if we aren't zoomed in on a project
      if (!activeProject) {
        setRotation((r) => r + e.deltaY * 0.0005)
      }
    }
    window.addEventListener('wheel', handleScroll)
    return () => window.removeEventListener('wheel', handleScroll)
  }, [activeProject])

  useFrame((state, delta) => {
    // Smoothly rotate the room based on scroll
    easing.dampE(groupRef.current.rotation, [0, rotation, 0], 0.3, delta)
  })

  // Helper for cursor hover
  const [hovered, setHover] = useState(null)
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }, [hovered])

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <mesh geometry={nodes.Center_floor.geometry} material={materials['Wet Asphalt Surface']} />
      <mesh geometry={nodes.Floor.geometry} material={materials['Wet Cracked Asphalt']} />
      <mesh geometry={nodes.Pillars.geometry} material={materials['Anthracite Grey Plastic']} />
      <mesh geometry={nodes.Roof.geometry} material={materials['Matte plastic plate with holes']} />
      <mesh geometry={nodes.arcade_3002_screen.geometry} material={materials['pantalas.001']} />
      
      {/* --- HITBOXES --- */}
      {/* SHOE HITBOX */}
      <mesh 
        geometry={nodes.Shoe_HitBox.geometry} 
        material={materials.HitBox} 
        position={[5.437, 1.607, 0.027]} 
        visible={false} // Make invisible but clickable
        onClick={(e) => { e.stopPropagation(); onProjectSelect('shoe') }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      />

      {/* WATCH HITBOX (Placeholder: I attached it to the arcade screen since Watch_HitBox was missing in your snippet) */}
      <mesh 
        geometry={nodes.arcade_3002_screen.geometry} 
        material={materials['pantalas.001']}
        onClick={(e) => { e.stopPropagation(); onProjectSelect('watch') }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
         {/* Optional: Add a visual indicator on hover */}
         <meshBasicMaterial color="white" transparent opacity={hovered ? 0.1 : 0} />
      </mesh>

      {/* REST OF SCENE */}
      <mesh geometry={nodes.Cube018.geometry} material={materials['plastic.001']} />
      <mesh geometry={nodes.Cube018_1.geometry} material={materials['metal.001']} />
      <mesh geometry={nodes.Cube018_2.geometry} material={materials['covers .001']} />
      <mesh geometry={nodes.Cube018_3.geometry} material={materials['coin arcade.001']} />
      <mesh geometry={nodes.Cube019.geometry} material={materials['buttons arcade.001']} />
      <mesh geometry={nodes.Cube019_1.geometry} material={materials['red plastic.001']} />
    </group>
  )
}

useGLTF.preload('/TheLabHub_V2-transformed.glb')


// --- 4. MAIN PAGE ---
export default function HomePage() {
  const [isStarted, setIsStarted] = useState(false)
  const [introStep, setIntroStep] = useState(0)
  const [activeProject, setActiveProject] = useState(null)

  const startExperience = () => {
    setIsStarted(true)
    setTimeout(() => setIntroStep(1), 300) 
  }

  // Back button handler
  const resetView = () => {
    setActiveProject(null)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'relative', overflow: 'hidden' }}>
      
      {/* UI OVERLAY */}
      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div 
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 1 }}
            className="hero-overlay"
          >
            <h1 className="title">FETCH & FIX // DIGITAL</h1>
            <p className="subtitle">WELCOME TO THE LAB 3.0</p>
            <button className="enter-btn" onClick={startExperience}>ENTER THE LAB</button>
          </motion.div>
        ) : activeProject ? (
          // BACK BUTTON WHEN ZOOMED IN
          <motion.div 
            key="back-ui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ position: 'absolute', top: 40, left: 40, zIndex: 100 }}
          >
             <button className="enter-btn" onClick={resetView}>← BACK TO LAB</button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* 3D SCENE */}
      <Canvas 
        shadows 
        camera={{ position: [-0.92, 18.96, 0.05], fov: 75 }}
        gl={{ toneMapping: THREE.AgXToneMapping, toneMappingExposure: 0.6 }}
      >
        <Suspense fallback={null}>
          <CameraRig 
            introStep={introStep} 
            activeProject={activeProject} 
            isStarted={isStarted} 
          />
          
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2ff" />
          
          <Model 
            activeProject={activeProject}
            onProjectSelect={(project) => setActiveProject(project)} 
          />
          
          <Environment preset="city" />
          <ContactShadows opacity={0.4} scale={20} blur={2.4} />
        </Suspense>
      </Canvas>

      <style>{`
        .hero-overlay {
          position: absolute; z-index: 10; width: 100%; height: 100%;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
        }
        .title { color: white; font-family: 'Inter', sans-serif; font-size: 4rem; letter-spacing: 15px; margin: 0; text-align: center; }
        .subtitle { color: #00f2ff; font-family: 'monospace'; letter-spacing: 5px; margin-top: 10px; }
        .enter-btn {
          pointer-events: auto; margin-top: 50px; padding: 15px 40px;
          background: none; border: 2px solid #00f2ff; color: #00f2ff;
          font-family: 'Inter', sans-serif; font-weight: bold; cursor: pointer;
          letter-spacing: 3px; transition: 0.3s;
        }
        .enter-btn:hover { background: #00f2ff; color: black; }
      `}</style>
    </div>
  )
}