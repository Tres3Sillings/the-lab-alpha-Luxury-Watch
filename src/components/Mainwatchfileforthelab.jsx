import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Model(props) {
  const { scene } = useGLTF('/mainwatchfileforthelab.glb')
  const scroll = useScroll()

  // Refs for parts
  const wholeWatchRef = useRef()
  const knobRef = useRef()
  const hourHandRef = useRef()
  const minuteHandRef = useRef()
  const glassRef = useRef()
  const dialRef = useRef()
  const mechanismRef = useRef()
  const mechanism2Ref = useRef()

  // Material Ref for the "Pulse" effect
  const glassMaterialRef = useRef()

  useEffect(() => {
    if (scene) {
      knobRef.current = scene.getObjectByName('adjustment_knob_main')
      hourHandRef.current = scene.getObjectByName('Hand_S') 
      minuteHandRef.current = scene.getObjectByName('Hand_L') 
      
      // Glass Setup
      const glassMesh = scene.getObjectByName('Glass')
      glassRef.current = glassMesh
      if (glassMesh) {
          // Clone material so we don't affect other transparent parts
          glassMesh.material = glassMesh.material.clone()
          glassMesh.material.transparent = true
          glassMesh.material.opacity = 0.3
          glassMesh.material.emissiveIntensity = 0
          glassMaterialRef.current = glassMesh.material
      }

      dialRef.current = scene.getObjectByName('Dial_main')
      mechanismRef.current = scene.getObjectByName('Mechanism')
      
      const uniqueChild = scene.getObjectByName('Mechanism_2_1')
      if (uniqueChild) mechanism2Ref.current = uniqueChild.parent
    }
  }, [scene])

  useFrame((state, delta) => {
    // 1. Get Scroll Data
    // We use a tighter damping or raw offset to prevent "missing" the animation
    const r = scroll.offset // 0 to 1

    // --- PHASE 1: SAPPHIRE ZOOM (0.0 to 0.3) ---
    // Goal: Zoom in close, Tilt down, Pulse Glass
    if (r < 0.33) {
        const t = r * 3 // Normalize 0-0.33 to 0-1
        
        // Move Watch Closer (Zoom Effect)
        // From Z=0 to Z=3 (Very close to camera)
        wholeWatchRef.current.position.z = THREE.MathUtils.lerp(1, 3, t)
        
        // Tilt to show reflection
        wholeWatchRef.current.rotation.x = THREE.MathUtils.lerp(0, -0.3, t)
        wholeWatchRef.current.rotation.y = THREE.MathUtils.lerp(0, 0.3, t)

        // PULSE EFFECT: Flash Blue
        if (glassMaterialRef.current) {
            // Sine wave pulse
            const pulse = (Math.sin(state.clock.elapsedTime * 4) + 1) * 0.5
            // Blend from Black (No emission) to Blue
            glassMaterialRef.current.emissive.setRGB(0, 0.2 * pulse, 0.5 * pulse)
            glassMaterialRef.current.emissiveIntensity = pulse * 2
        }
    } 
    
    // --- PHASE 2: DIAL REVEAL (0.33 to 0.66) ---
    // Goal: Zoom out slightly, Flat view, Glass explodes away
    else if (r >= 0.33 && r < 0.66) {
        const t = (r - 0.33) * 3 // Normalize

        // Reset Pulse
        if (glassMaterialRef.current) glassMaterialRef.current.emissiveIntensity = 0

        // Move Camera Back slightly for overview
        wholeWatchRef.current.position.z = THREE.MathUtils.lerp(3, 1, t)

        // Rotate to Flat "Blueprint" View
        wholeWatchRef.current.rotation.x = THREE.MathUtils.lerp(-0.3, 0, t)
        wholeWatchRef.current.rotation.y = THREE.MathUtils.lerp(0.3, 0, t)

        // EXPLOSION: Glass flies WAY off screen
        if (glassRef.current) glassRef.current.position.z = -0.015 + (t * 0.5)
        
        // Dial lifts slightly
        if (dialRef.current) dialRef.current.position.z = -0.015 + (t * 0.1)
    }

    // --- PHASE 3: MOVEMENT (0.66 to 1.0) ---
    // Goal: Angle side view, Dial flies away, Gears exposed
    else {
        const t = (r - 0.66) * 3 // Normalize

        wholeWatchRef.current.position.z = THREE.MathUtils.lerp(1, 8, t)// Keep at overview distance

        // Rotate to Side Profile
        wholeWatchRef.current.rotation.y = THREE.MathUtils.lerp(0, 1.2, t)

        // EXPLOSION: Dial flies away
        if (dialRef.current) dialRef.current.position.z = (-0.015 + 0.1) + (t * 0.5)

        // Hands fly with dial
        if (hourHandRef.current) hourHandRef.current.position.z = dialRef.current.position.z
        if (minuteHandRef.current) minuteHandRef.current.position.z = dialRef.current.position.z

        // Mech expands
        if (mechanismRef.current) mechanismRef.current.position.z = -0.015 + (t * 0.1)
    }

    // CONSTANT ANIMATIONS
    if (knobRef.current) knobRef.current.rotation.x += delta * 2
    if (hourHandRef.current) hourHandRef.current.rotation.y -= delta * 0.1 
    if (minuteHandRef.current) minuteHandRef.current.rotation.y -= delta * 1.5 
  })

  return <primitive ref={wholeWatchRef} object={scene} {...props} />
}