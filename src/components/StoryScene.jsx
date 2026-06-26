import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Float, Sparkles, Stars, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { easing } from 'maath'

// --- HELPER COMPONENT FOR WATCH MODEL ---
function WatchModel({ active, ...props }) {
  const [hasBeenActive, setHasBeenActive] = React.useState(false)

  React.useEffect(() => {
    if (active) {
      setHasBeenActive(true)
    }
  }, [active])

  if (!hasBeenActive) return null

  return <WatchInner active={active} {...props} />
}

function WatchInner({ active, ...props }) {
  const { scene } = useGLTF('/mainwatchfileforthelab.glb')
  const groupRef = useRef()
  const knobRef = useRef()
  const hourHandRef = useRef()
  const minuteHandRef = useRef()

  React.useEffect(() => {
    if (scene) {
      knobRef.current = scene.getObjectByName('adjustment_knob_main')
      hourHandRef.current = scene.getObjectByName('Hand_S') 
      minuteHandRef.current = scene.getObjectByName('Hand_L')
    }
  }, [scene])

  useFrame((state, delta) => {
    const targetScale = active ? 22 : 0
    easing.damp3(groupRef.current.scale, [targetScale, targetScale, targetScale], 0.25, delta)
    if (active) {
      groupRef.current.rotation.y += delta * 0.2
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2
      if (knobRef.current) knobRef.current.rotation.x += delta * 2
      if (hourHandRef.current) hourHandRef.current.rotation.y -= delta * 0.05
      if (minuteHandRef.current) minuteHandRef.current.rotation.y -= delta * 0.8
    }
  })

  return <group ref={groupRef} {...props}><primitive object={scene} /></group>
}

// --- HELPER COMPONENT FOR THE LAB HUB HUB MODEL ---
function HubModel({ active, ...props }) {
  const { nodes, materials } = useGLTF('/TheLabHub_V2-transformed.glb')
  const groupRef = useRef()
  const orbitRef = useRef()

  useFrame((state, delta) => {
    const targetScale = active ? 0.35 : 0
    easing.damp3(groupRef.current.scale, [targetScale, targetScale, targetScale], 0.25, delta)
    if (active) {
      groupRef.current.rotation.y += delta * 0.08
      if (orbitRef.current) {
        orbitRef.current.rotation.y += delta * 0.4
      }
    }
  })

  useEffect(() => {
    if (nodes && nodes.Orbit) {
      orbitRef.current = nodes.Orbit
    }
  }, [nodes])

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <mesh name="Center_floor" geometry={nodes.Center_floor.geometry} material={materials['Wet Asphalt Surface']} />
      <mesh name="Floor" geometry={nodes.Floor.geometry} material={materials['Wet Cracked Asphalt']} />
      <mesh name="Pillars" geometry={nodes.Pillars.geometry} material={materials['Anthracite Grey Plastic']} />
      <mesh name="Roof" geometry={nodes.Roof.geometry} material={materials['Matte plastic plate with holes']} />
      <mesh name="Walls" geometry={nodes.Walls.geometry} material={materials['Wet Cracked Asphalt']} />
      <mesh name="Floor_Pad" geometry={nodes.Floor_Pad.geometry} material={materials['Wet Asphalt Surface']} />
      <mesh name="Orbit" ref={orbitRef} geometry={nodes.Orbit.geometry} material={materials.Neon} rotation={[0, Math.PI / 2, 0]} />
    </group>
  )
}

// --- MAIN EXPERIENCE WRAPPER ---
export default function StoryScene({ activeSection }) {
  const { camera } = useThree()
  const pointLightRef = useRef()
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Define light color matching section mapping (Unifying in the cyan/blue spectrum)
  const activeColor = useMemo(() => {
    switch (activeSection) {
      case 0: return new THREE.Color("#00f2ff") // Cyan
      case 1: return new THREE.Color("#00a2ff") // Neon Blue
      case 2: return new THREE.Color("#00f2ff") // Cyan
      case 3: return new THREE.Color("#0088ff") // Deep Blue
      case 4: return new THREE.Color("#00f2ff") // Cyan
      case 5: return new THREE.Color("#00a2ff") // Neon Blue
      case 6: return new THREE.Color("#ffffff") // White
      default: return new THREE.Color("#00f2ff")
    }
  }, [activeSection])

  useFrame((state, delta) => {
    // Camera Rigging based on section
    let targetCamPos = [0, 0, 8]
    let targetCamLook = [0, 0, 0]

    switch (activeSection) {
      case 0: // Hero
        targetCamPos = [0, 0, 7]
        targetCamLook = [0, 0, 0]
        break
      case 2: // Watch / 3D Detail
        targetCamPos = [1.8, -0.3, 4.5]
        targetCamLook = [0, 0, 0]
        break
      case 4: // Projects Hub
        targetCamPos = [-2.0, 1.2, 5.0]
        targetCamLook = [0.2, 0, 0]
        break
      case 6: // Portal Gateway
        targetCamPos = [0, 4.0, 0.1]
        targetCamLook = [0, -2, 0]
        break
      default:
        targetCamPos = [0, 0, 8]
        targetCamLook = [0, 0, 0]
    }

    // Smoothly interpolate camera position
    easing.damp3(camera.position, targetCamPos, 0.45, delta)
    
    // Smoothly interpolate camera lookAt
    const currentLook = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position)
    const targetLookVec = new THREE.Vector3(...targetCamLook)
    const lerpedLook = new THREE.Vector3().lerpVectors(currentLook, targetLookVec, 0.1)
    camera.lookAt(lerpedLook)

    // Smoothly color/intensity transition of custom point light
    if (pointLightRef.current) {
      pointLightRef.current.color.lerp(activeColor, 0.1)
      const targetIntensity = activeSection === 6 ? 12 : 3
      pointLightRef.current.intensity = THREE.MathUtils.lerp(pointLightRef.current.intensity, targetIntensity, 0.1)
    }
  })

  return (
    <>
      {/* City Environment map for realistic metal reflections */}
      <Environment preset="city" />

      {/* Dynamic atmospheric lighting */}
      <ambientLight intensity={0.15} />
      <pointLight ref={pointLightRef} position={[2, 4, 3]} intensity={3} distance={15} />
      <spotLight position={[-4, 8, 4]} angle={0.3} penumbra={1} intensity={1.0} color="#ffffff" />
      
      {/* Decorative ambient elements - Unified Cyan theme */}
      <Sparkles count={isMobile ? 15 : 30} scale={6} size={1.2} speed={0.4} color="#00f2ff" />
      <Stars radius={100} depth={50} count={isMobile ? 80 : 200} factor={3} saturation={0.5} fade speed={0.8} />

      {/* 3D Elements controlled by active sections */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.6}>
        <HubModel active={activeSection === 0 || activeSection === 4} position={[0, -0.6, 0]} />
        <WatchModel active={activeSection === 2} position={[-0.4, 0.2, 0]} />
      </Float>

      {/* Gateway Portal Portal Pad inside the Canvas (only shows up for section 6) */}
      {activeSection === 6 && (
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.1, 2.5, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.65} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </>
  )
}

// Preload resources for speed
useGLTF.preload('/TheLabHub_V2-transformed.glb')
