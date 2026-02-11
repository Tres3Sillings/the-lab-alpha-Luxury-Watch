import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Accept scrollProgress as a prop (0.0 = closed, 1.0 = fully open)
export default function Model({ scrollProgress = 0, ...props }) {
  // 1. Load the scene
  const { scene } = useGLTF('/mainwatchfileforthelab.glb')

  const wholeWatchRef = useRef()
  const knobRef = useRef()
  const hourHandRef = useRef()
  const minuteHandRef = useRef()
  const glassRef = useRef()
  // New refs for the explosion layers
  const dialRef = useRef()
  const mechanismRef = useRef()
  const mechanism2Ref = useRef()

  // Base Z position roughly where the face sits (from previous code)
  const baseZ = -0.015;

  // 2. Grab all necessary parts by name
  useEffect(() => {
    if (scene) {
      // console.log("Grabbing parts for explosion effect...");
      knobRef.current = scene.getObjectByName('adjustment_knob_main')
      // Trying parent groups for hands first for better rotation center
      hourHandRef.current = scene.getObjectByName('Hand_S') || scene.getObjectByName('Hand_S_1')
      minuteHandRef.current = scene.getObjectByName('Hand_L') || scene.getObjectByName('Hand_L_1')
      glassRef.current = scene.getObjectByName('Glass')
      
      // Grab the new layers based on Blender hierarchy
      dialRef.current = scene.getObjectByName('Dial')
      mechanismRef.current = scene.getObjectByName('Mechanism')
      mechanism2Ref.current = scene.getObjectByName('Mechanism_2')
    }
  }, [scene])

  // 3. Animate based on scrollProgress prop
  useFrame((state, delta) => {
    
    // --- A. CONSTANT ANIMATIONS (Hands & Knob) ---
    if (knobRef.current) knobRef.current.rotation.x += delta * 2
    if (hourHandRef.current) hourHandRef.current.rotation.y -= delta * 0.1 
    if (minuteHandRef.current) minuteHandRef.current.rotation.y -= delta * 1.5 

    // --- B. EXPLOSION EFFECT (Based on scrollProgress prop) ---
    // We move parts along Z axis to separate them
    // The multiplier determines how far that part moves.

    // Glass: Moves farthest (e.g., 15 units out)
    if (glassRef.current) {
       glassRef.current.position.z = baseZ + (scrollProgress * 0.15)
    }

    // Dial & Hands: Move together, medium distance (e.g., 10 units out)
    const dialDistance = baseZ + (scrollProgress * 0.10);
    if (dialRef.current) dialRef.current.position.z = dialDistance
    if (hourHandRef.current) hourHandRef.current.position.z = dialDistance
    if (minuteHandRef.current) minuteHandRef.current.position.z = dialDistance

    // Mechanism 1: Moves slightly (e.g., 5 units out)
    if (mechanismRef.current) {
        mechanismRef.current.position.z = baseZ + (scrollProgress * 0.05)
    }

    // Mechanism 2: Moves barely (e.g., 2 units out)
    if (mechanism2Ref.current) {
        mechanism2Ref.current.position.z = baseZ + (scrollProgress * 0.02)
    }
    
    // Case: Stays put at baseZ (or you could move it slightly backward: baseZ - (scrollProgress * 0.01))

    // --- C. CINEMATIC TILT ---
    // Rotate the entire watch slightly as it explodes to show depth.
    if (wholeWatchRef.current) {
        // Start with initial tilt angles defined in App.jsx, then add scroll factor
        // We use linear interpolation (lerp) for smooth transition
        
        // Tilt X up slightly as it opens
        wholeWatchRef.current.rotation.x = THREE.MathUtils.lerp(props.rotation[0], props.rotation[0] + 0.3, scrollProgress)
        // Rotate Y sideways slightly as it opens
        wholeWatchRef.current.rotation.y = THREE.MathUtils.lerp(props.rotation[1], props.rotation[1] - 0.4, scrollProgress)
    }
  })

  return (
    <primitive 
      ref={wholeWatchRef}
      object={scene} 
      {...props} // Passes initial rotation/scale from App.jsx
    />
  )
}

useGLTF.preload('/mainwatchfileforthelab.glb')