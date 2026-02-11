import React, { useEffect, useRef } from 'react'
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
  const glassMaterialRef = useRef()

  // Capture Refs for clean hand-offs
  const lerpStartPos = useRef(new THREE.Vector3())
  const lerpStartRot = useRef(new THREE.Euler())
  const lerpStartExplosion = useRef({ glass: -0.015, dial: -0.015, mech: -0.015 })

  useEffect(() => {
    if (scene) {
      knobRef.current = scene.getObjectByName('adjustment_knob_main')
      hourHandRef.current = scene.getObjectByName('Hand_S') 
      minuteHandRef.current = scene.getObjectByName('Hand_L') 
      glassRef.current = scene.getObjectByName('Glass')
      dialRef.current = scene.getObjectByName('Dial_main')
      mechanismRef.current = scene.getObjectByName('Mechanism')
      
      if (glassRef.current) {
          glassRef.current.material = glassRef.current.material.clone()
          glassRef.current.material.transparent = true
          glassRef.current.material.opacity = 0.3
          glassMaterialRef.current = glassRef.current.material
      }
    }
  }, [scene])

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1); 
    const r = scroll.offset;

    // 1. Targets
    let targetX = 0, targetY = 0, targetZ = 0;
    let targetRotX = 0, targetRotY = 0;
    let targetDialZ = -0.015, targetGlassZ = -0.015, targetMechZ = -0.015;

    if (wholeWatchRef.current) {
      lerpStartPos.current.copy(wholeWatchRef.current.position);
      lerpStartRot.current.copy(wholeWatchRef.current.rotation);
    }

    // --- PHASE LOGIC ---
    if (r < 0.25) {
      const t = r * 4;
      targetX = THREE.MathUtils.lerp(0, -2, t);
      targetZ = THREE.MathUtils.lerp(0, 4, t);
      targetRotX = THREE.MathUtils.lerp(0, -0.4, t);
      targetRotY = THREE.MathUtils.lerp(0, 1, t);
      
      if (glassMaterialRef.current) {
        const pulse = (Math.sin(state.clock.elapsedTime * 4) + 1) * 0.5;
        glassMaterialRef.current.emissive.setRGB(0, 0.2 * pulse, 0.5 * pulse);
        glassMaterialRef.current.emissiveIntensity = pulse * 2;
      }
    } 
    else if (r < 0.50) {
      const t = (r - 0.25) * 4;
      if (glassMaterialRef.current) glassMaterialRef.current.emissiveIntensity = 0;
      targetX = -2;
      targetZ = THREE.MathUtils.lerp(4, 1, t);
      targetRotX = THREE.MathUtils.lerp(-0.4, 0, t);
      targetRotY = THREE.MathUtils.lerp(0.9, 0, t);
      targetGlassZ = -0.015 + t * 0.9;
      targetDialZ = -0.015 + t * 0.2;
    } 
    else if (r < 0.75) {
      const t = (r - 0.50) * 4;
      targetX = THREE.MathUtils.lerp(-2, 0, t); 
      targetZ = THREE.MathUtils.lerp(1, 4, t);
      targetGlassZ = 0.885; // Previous max
      targetDialZ = 0.185 + (t * 0.1);
      targetMechZ = -0.015 + (t * 0.1);
    } 
    else {
      const t = (r - 0.75) * 4;
      targetZ = THREE.MathUtils.lerp(4, 14, t);
      targetGlassZ = 0.885;
      targetDialZ = 0.285 + (t * 0.5);
      targetMechZ = 0.085 + (t * 0.1);
    }

    // --- APPLY SMOOTHING (The Engine) ---
    const watchSmooth = 4;
    const partSmooth = 6; // Lighter parts move faster

    // Whole Watch
    wholeWatchRef.current.position.x = THREE.MathUtils.damp(wholeWatchRef.current.position.x, targetX, watchSmooth, safeDelta);
    wholeWatchRef.current.position.y = THREE.MathUtils.damp(wholeWatchRef.current.position.y, targetY, watchSmooth, safeDelta);
    wholeWatchRef.current.position.z = THREE.MathUtils.damp(wholeWatchRef.current.position.z, targetZ, watchSmooth, safeDelta);
    wholeWatchRef.current.rotation.x = THREE.MathUtils.damp(wholeWatchRef.current.rotation.x, targetRotX, watchSmooth, safeDelta);
    wholeWatchRef.current.rotation.y = THREE.MathUtils.damp(wholeWatchRef.current.rotation.y, targetRotY, watchSmooth, safeDelta);

    // Floating Parts
    if (dialRef.current) {
      dialRef.current.position.z = THREE.MathUtils.damp(dialRef.current.position.z, targetDialZ, partSmooth, safeDelta);
      // Hands locked to dial
      if (hourHandRef.current) hourHandRef.current.position.z = dialRef.current.position.z;
      if (minuteHandRef.current) minuteHandRef.current.position.z = dialRef.current.position.z;
    }
    if (glassRef.current) {
      glassRef.current.position.z = THREE.MathUtils.damp(glassRef.current.position.z, targetGlassZ, partSmooth, safeDelta);
    }
    if (mechanismRef.current) {
      mechanismRef.current.position.z = THREE.MathUtils.damp(mechanismRef.current.position.z, targetMechZ, partSmooth, safeDelta);
    }

    // Spin Animations
    if (knobRef.current) knobRef.current.rotation.x += delta * 2;
    if (hourHandRef.current) hourHandRef.current.rotation.y -= delta * 0.1;
    if (minuteHandRef.current) minuteHandRef.current.rotation.y -= delta * 1.5;
  });

  return <primitive ref={wholeWatchRef} object={scene} position={[0, 0, 0]} {...props} />
}