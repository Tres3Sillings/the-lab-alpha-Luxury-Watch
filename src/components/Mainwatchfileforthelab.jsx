import React, { useEffect, useRef } from 'react'
import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Model(props) {
  const { scene } = useGLTF('/mainwatchfileforthelab.glb')
  const scroll = useScroll()

  // Refs
  const wholeWatchRef = useRef()
  const knobRef = useRef()
  const hourHandRef = useRef()
  const minuteHandRef = useRef()
  const glassRef = useRef()
  const dialRef = useRef()
  const mechanismRef = useRef()
  const mechanism2Ref = useRef()

  const baseZ = -0.015;

  useEffect(() => {
    if (scene) {
      knobRef.current = scene.getObjectByName('adjustment_knob_main')
      hourHandRef.current = scene.getObjectByName('Hand_S') 
      minuteHandRef.current = scene.getObjectByName('Hand_L') 
      glassRef.current = scene.getObjectByName('Glass')
      dialRef.current = scene.getObjectByName('Dial_main')
      mechanismRef.current = scene.getObjectByName('Mechanism')
      
      const uniqueChild = scene.getObjectByName('Mechanism_2_1')
      if (uniqueChild) mechanism2Ref.current = uniqueChild.parent
    }
  }, [scene])

  useFrame((state, delta) => {
    const rTilt = scroll.range(0, 0.2)
    const rExplode = scroll.range(0.2, 0.8)

    // 1. PASSIVE ANIMATION
    if (knobRef.current) knobRef.current.rotation.x += delta * 2
    if (hourHandRef.current) hourHandRef.current.rotation.y -= delta * 0.1 
    if (minuteHandRef.current) minuteHandRef.current.rotation.y -= delta * 1.5 

    // 2. CINEMATIC TILT (Phase 1)
    if (wholeWatchRef.current) {
        wholeWatchRef.current.rotation.x = THREE.MathUtils.lerp(0.2, 0.5, rTilt)
        wholeWatchRef.current.rotation.y = THREE.MathUtils.lerp(-0.2, -0.9, rTilt)
        wholeWatchRef
    }

    // 3. EXPLOSION (Phase 2)
    if (wholeWatchRef.current) {
      // Move watch closer to camera (simulated scale)
      wholeWatchRef.current.position.z = THREE.MathUtils.lerp(0, 5, rExplode)
    }

    if (glassRef.current) glassRef.current.position.z = (baseZ + 0.005) + (rExplode * 0.35)
    
    const dialDist = baseZ + (rExplode * 0.20);
    if (dialRef.current) dialRef.current.position.z = dialDist
    if (hourHandRef.current) hourHandRef.current.position.z = dialDist
    if (minuteHandRef.current) minuteHandRef.current.position.z = dialDist

    if (mechanismRef.current) mechanismRef.current.position.z = baseZ + (rExplode * 0.10)
    if (mechanism2Ref.current) mechanism2Ref.current.position.z = baseZ + (rExplode * 0.04)
  })

  return <primitive ref={wholeWatchRef} object={scene} {...props} />
}