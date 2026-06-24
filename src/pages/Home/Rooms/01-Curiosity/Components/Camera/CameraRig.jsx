import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Camera Rig component to apply subtle camera parallax tracking the mouse cursor
export default function CameraRig({ children }) {
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Calculate target horizontal and vertical offsets based on mouse position (-1 to 1)
      const targetX = state.pointer.x * 0.15
      const targetY = state.pointer.y * 0.1

      // Smoothly interpolate rig positions using linear interpolation (lerp)
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 4)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 4)

      // Add subtle camera rotation offsets (pan and tilt) matching cursor direction
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -state.pointer.x * 0.05, delta * 4)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.04, delta * 4)
    }
  })

  return <group ref={groupRef}>{children}</group>
}
