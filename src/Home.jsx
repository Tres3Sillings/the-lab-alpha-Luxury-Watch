import React, { useState, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, Html, OrbitControls } from '@react-three/drei'
import gsap from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

/* --- 1. THE 3D MODEL COMPONENT --- */
function Model({ onDeskClick, ...props }) {
  const { nodes, materials } = useGLTF('/rooomtestthing.glb')
  
  // This function handles the click logic
  const handleClick = () => {
    if (onDeskClick) onDeskClick()
  }

  return (
    <group {...props} dispose={null}>
      {/* MONITOR GROUP */}
      <group position={[0.915, 0.76, 0.915]} rotation={[Math.PI, 0, Math.PI]}>
        <mesh geometry={nodes.Foot.geometry} material={materials.BlackPlastic} position={[0, 0.251, 0.024]} />
        <mesh geometry={nodes.Handles.geometry} material={materials.BlackPlastic} position={[0.145, 0.2, 0.018]} rotation={[-0.217, 0, 0]} />
        <mesh geometry={nodes.Screen.geometry} material={materials.Screen} position={[0, 0.244, 0.013]} rotation={[1.353, 0, 0]} />
        <mesh geometry={nodes.Screen2.geometry} material={materials.BlackPlastic} position={[0, 0.244, 0.013]} rotation={[1.353, 0, 0]}>
          <mesh geometry={nodes.Cutter.geometry} material={nodes.Cutter.material} position={[0.145, -0.012, 0]} rotation={[0, 0, Math.PI]} scale={[1, 1, 0.872]} />
        </mesh>
      </group>

      {/* KEYBOARD GROUP (Simplified for brevity, kept all your meshes) */}
      <group position={[0.89, 0.762, 0.683]} rotation={[0, -1.571, 0]}>
        {/* ... (Keep all your keyboard meshes here, I collapsed them to save space for you) ... */}
        <mesh geometry={nodes.Cube005.geometry} material={materials['keyboard key.001']} position={[-0.015, 0.023, 0.171]} />
        <mesh geometry={nodes.Cube006.geometry} material={materials['keyboard key.001']} position={[0.007, 0.023, 0.165]} />
        {/* ... rest of keyboard ... */}
      </group>

      {/* ROOM BASICS */}
      <mesh geometry={nodes.Floor.geometry} material={materials['Wood Floor.001']} />
      <mesh geometry={nodes.Walls.geometry} material={materials['Painted Wall Procedural']} />

      {/* --- THE TRIGGER --- */}
      <mesh 
        geometry={nodes.Desk_Trigger.geometry} 
        material={materials['Material.103']} 
        position={[0.856, 0.828, 0.536]} 
        scale={[1, 1, 0.526]} 
        onClick={handleClick} // <--- The Magic Click Event
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
        visible={false} // Make it invisible to the user!
      />

      {/* DESK */}
      <group position={[0.876, 0, 0.736]} rotation={[Math.PI, 0, Math.PI]}>
        <mesh geometry={nodes.Desk.geometry} material={materials.DeskBody} />
        <mesh geometry={nodes.Desk_1.geometry} material={materials.TableTop} />
        <mesh geometry={nodes.Desk_2.geometry} material={materials.Handle} />
      </group>
    </group>
  )
}

/* --- 2. CAMERA CONTROLLER --- */
function CameraController({ zoom }) {
  const { camera, controls } = useThree()

  React.useEffect(() => {
    // --- 1. ZOOMED IN (Desk View) ---
    // ✅ I pasted your NEW Position numbers here:
    const deskPosition = new THREE.Vector3(0.271, 1.311, -0.562)
    
    // ✅ I created a "Safe Bet" target (Looking at the Monitor):
    const deskTarget = new THREE.Vector3(0.85, 0.75, 0.6) 

    // --- 2. ZOOMED OUT (Room View) ---
    // (These are the ones we fixed earlier)
    const roomPosition = new THREE.Vector3(-0.875, 1.726, -1.826) 
    const roomTarget = new THREE.Vector3(0, 1.0, 0) // Looking at room center

    if (zoom) {
      // ZOOM IN ANIMATION
      gsap.to(camera.position, {
        x: deskPosition.x, y: deskPosition.y, z: deskPosition.z,
        duration: 1.5, ease: "power2.inOut"
      })
      if(controls) {
        gsap.to(controls.target, {
          x: deskTarget.x, y: deskTarget.y, z: deskTarget.z,
          duration: 1.5, ease: "power2.inOut"
        })
      }
    } else {
      // ZOOM OUT ANIMATION
      gsap.to(camera.position, {
        x: roomPosition.x, y: roomPosition.y, z: roomPosition.z,
        duration: 1.5, ease: "power2.inOut"
      })
      
      if(controls) {
        gsap.to(controls.target, {
          x: roomTarget.x, y: roomTarget.y, z: roomTarget.z,
          duration: 1.5, ease: "power2.inOut"
        })
      }
    }
  }, [zoom, camera, controls])
  return null
}

/* --- 3. THE MAIN PAGE COMPONENT --- */
export default function Experience() {
  const [zoomed, setZoomed] = useState(false)

  return (
  <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
    
    {/* 3D SCENE */}
    <Canvas camera={{ position: [-0.875, 1.726, -1.826], fov: 45 }}>
      
      {/* 1. CONTROLS: Add makeDefault so your CameraController can find them */}
      <OrbitControls 
        makeDefault 
        enableZoom={!zoomed} // Disable manual zoom when we are focused on the desk
        onEnd={(e) => {
          // OPEN CONSOLE (F12) TO SEE THESE NUMBERS
          console.log("Position (X,Y,Z):", e.target.object.position)
          console.log("Target (LookAt):", e.target.target)
        }}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="city" />
      
      <Model onDeskClick={() => setZoomed(true)} />
      
      {/* 2. LOGIC: Your custom animator */}
      <CameraController zoom={zoomed} />
      
    </Canvas>

      {/* HTML OVERLAY MENU */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,0,0,0.8)',
              padding: '40px',
              borderRadius: '20px',
              color: 'white',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <h2>Welcome Home</h2>
            <p style={{marginBottom: '20px', color: '#ccc'}}>Where would you like to go?</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <button style={btnStyle} onClick={() => window.location.href = '/home'}>🏠 Home</button>
              <button style={btnStyle} onClick={() => window.location.href = '/watch'}>📺 Watch</button>
              <button style={btnStyle} onClick={() => window.location.href = '/shoe'}>👟 Shop</button>
              
              <hr style={{margin: '15px 0', borderColor: '#444'}}/>
              
              <button 
                style={{...btnStyle, color: '#ffffff',background: 'transparent', border: '1px solid #666'}}
                onClick={() => setZoomed(false)} // Go back to room view
              >
                ← Back to Room
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint UI */}
      {!zoomed && (
        <div style={{
          position: 'absolute', 
          bottom: '50px', 
          left: '50%', 
          transform: 'translate(-50%, 0)', 
          color: 'black', 
          pointerEvents: 'none',
          opacity: 0.7
        }}>
          Click the desk to explore
        </div>
      )}

    </div>
  )
}

const btnStyle = {
  padding: '12px 24px',
  borderRadius: '8px',
  border: 'none',
  background: '#ffffff',
  color: 'black',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '16px',
  transition: '0.2s',
}

useGLTF.preload('/rooomtestthing.glb')