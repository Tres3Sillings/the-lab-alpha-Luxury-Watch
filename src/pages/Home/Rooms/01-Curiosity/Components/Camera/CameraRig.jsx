import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Snap presets for camera focus points in each room
const SNAP_PRESETS = {
  curiosity: {
    PC:          { x: -0.4,  y: 0.15, z: 0.9,  rotX: -0.08, rotY: 0.25 },
    Book:        { x: 0.1,   y: 0.05, z: 0.8,  rotX: -0.08, rotY: -0.15 },
    Calculator:  { x: 0.25,  y: 0.02, z: 0.75, rotX: -0.08, rotY: -0.1 },
    Notebook:    { x: 0.2,   y: 0.08, z: 0.9,  rotX: -0.05, rotY: -0.05 },
    Cup:         { x: 0.02,  y: 0.08, z: 0.95, rotX: -0.05, rotY: -0.02 },
    Sticker1:    { x: -0.05, y: 0.05, z: 0.7,  rotX: -0.08, rotY: 0.05 },
    Sticker2:    { x: -0.2,  y: 0.05, z: 0.7,  rotX: -0.08, rotY: 0.1 },
    Sticker3:    { x: 0.1,   y: 0.05, z: 0.7,  rotX: -0.08, rotY: -0.05 },
    Sticker4:    { x: -0.05, y: 0.05, z: 0.5,  rotX: -0.08, rotY: 0.05 },
    Sticker5:    { x: 0.15,  y: 0.05, z: 0.5,  rotX: -0.08, rotY: -0.05 }
  },
  workshop: {
    Laptop:      { x: 0.03,  y: 0.45, z: 1.6,  rotX: -0.15, rotY: -0.03 },
    Book:        { x: -0.35, y: 0.4,  z: 1.3,  rotX: -0.18, rotY: 0.12 },
    Notebook1:   { x: 0.4,   y: 0.4,  z: 1.2,  rotX: -0.18, rotY: -0.12 },
    Notebook2:   { x: 0.5,   y: 0.45, z: 1.5,  rotX: -0.15, rotY: -0.15 },
    Cup:         { x: 0.15,  y: 0.35, z: 1.4,  rotX: -0.15, rotY: -0.05 }
  }
}

// Camera Rig component to apply subtle camera parallax tracking the mouse cursor
// or focus on a specific desk object if activeObject is set.
export default function CameraRig({ children, room = 'curiosity', activeObject = null }) {
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (groupRef.current) {
      const roomPresets = SNAP_PRESETS[room] || {}
      const snap = activeObject ? roomPresets[activeObject] : null

      let targetX = 0
      let targetY = 0
      let targetZ = 0
      let targetRotX = 0
      let targetRotY = 0

      // Clamp delta to avoid insane jump values on tab switch/lag
      const safeDelta = Math.min(0.1, delta)

      if (snap) {
        // Focused camera state: snap values + tiny auto-sway for life
        const time = state.clock.getElapsedTime()
        const autoX = Math.sin(time * 0.35) * 0.015
        const autoY = Math.cos(time * 0.25) * 0.01

        targetX = snap.x + autoX
        targetY = snap.y + autoY
        targetZ = -snap.z // Zoom in (negative local Z direction)
        targetRotX = snap.rotX
        targetRotY = snap.rotY
      } else {
        // Idle camera state: organic auto-sway + mouse pointer parallax
        const time = state.clock.getElapsedTime()
        const autoX = Math.sin(time * 0.35) * 0.05
        const autoY = Math.cos(time * 0.25) * 0.03

        targetX = state.pointer.x * 0.15 + autoX
        targetY = state.pointer.y * 0.1 + autoY
        targetZ = 0
        targetRotY = -state.pointer.x * 0.05 + (autoX * 0.3)
        targetRotX = state.pointer.y * 0.04 + (autoY * 0.3)
      }

      // Smoothly interpolate position and rotation
      const lerpSpeed = snap ? 5 : 3
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, safeDelta * lerpSpeed)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, safeDelta * lerpSpeed)
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, safeDelta * lerpSpeed)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, safeDelta * lerpSpeed)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, safeDelta * lerpSpeed)
    }
  })

  return <group ref={groupRef}>{children}</group>
}

