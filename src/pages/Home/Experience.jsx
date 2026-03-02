import React, { useEffect, useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { easing } from 'maath'
import * as THREE from 'three'
import { Model } from './components/TheLabHub_V2.jsx'

// --- BACKGROUND SHADER DEFINITION ---
const BackgroundShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#020202") },
    uAccent: { value: new THREE.Color("#00f2ff") },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uAccent;
    varying vec2 vUv;

    float noise(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      float n = noise(uv + uTime * 0.02);
      float dist = distance(uv, vec2(0.5));
      
      // Deep radial glow
      vec3 color = mix(uAccent * 0.04, uColor, dist * 1.4);
      
      // CRT Grain
      color += n * 0.015;

      gl_FragColor = vec4(color, 1.0);
    }
  `
}

const PROJECT_MAP = {
  'shoe':       { cam: 'cam_01', target: 'HitBox_01' },
  'watch':      { cam: 'cam_02', target: 'HitBox_02' },
  'project_03': { cam: 'cam_03', target: 'HitBox_03' },
  'project_04': { cam: 'cam_04', target: 'HitBox_04' },
  'project_05': { cam: 'cam_05', target: 'HitBox_05' },
  'project_06': { cam: 'cam_06', target: 'HitBox_06' },
  'project_07': { cam: 'cam_07', target: 'HitBox_07' },
  'project_08': { cam: 'cam_08', target: 'HitBox_08' },
}

function CameraRig({ isStarted, activeProject }) {
  const { scene } = useThree()
  
  const pos_Start = useMemo(() => new THREE.Vector3(-0.92, 18.96, 0.05), [])
  const look_Start = useMemo(() => new THREE.Vector3(-0.92, 0, 0.05), [])
  const pos_Hub = useMemo(() => new THREE.Vector3(0.7, 2.24, 0.19), [])
  const look_Hub = useMemo(() => new THREE.Vector3(3.51, 1.2, 0.37), [])

  const targetPos = useRef(new THREE.Vector3().copy(pos_Start))
  const targetLook = useRef(new THREE.Vector3().copy(look_Start))
  const targetQuat = useRef(new THREE.Quaternion())
  const m = useRef(new THREE.Matrix4())

  useFrame((state, delta) => {
    let foundCam = null
    let foundTarget = null

    if (activeProject && PROJECT_MAP[activeProject]) {
      const names = PROJECT_MAP[activeProject]
      foundCam = scene.getObjectByName(names.cam)
      foundTarget = scene.getObjectByName(names.target)
    }

    if (foundCam && foundTarget) {
      foundCam.updateMatrixWorld()
      foundTarget.updateMatrixWorld()
      foundCam.getWorldPosition(targetPos.current)
      foundTarget.getWorldPosition(targetLook.current)
    } 
    else if (!isStarted) {
      const t = state.clock.getElapsedTime()
      targetPos.current.set(
        pos_Start.x + Math.sin(t * 0.2) * 0.5, 
        pos_Start.y + Math.cos(t * 0.2) * 0.2, 
        pos_Start.z + Math.cos(t * 0.2) * 0.5
      )
      targetLook.current.copy(look_Start)
    } 
    else {
      targetPos.current.copy(pos_Hub)
      targetLook.current.copy(look_Hub)
    }

    m.current.lookAt(state.camera.position, targetLook.current, state.camera.up)
    targetQuat.current.setFromRotationMatrix(m.current)

    easing.damp3(state.camera.position, targetPos.current, 0.5, delta)
    easing.dampQ(state.camera.quaternion, targetQuat.current, 0.5, delta)
  })

  return null
}

export default function Experience({ isStarted, activeProject, onProjectSelect, rotationY, setRotationY }) {
  const groupRef = useRef()
  const orbitMeshRef = useRef()
  const shaderRef = useRef()
  const isDragging = useRef(false)
  const previousX = useRef(0)
  const { gl, scene } = useThree()

  useEffect(() => {
    const orbit = scene.getObjectByName('Orbit')
    if (orbit) orbitMeshRef.current = orbit
  }, [scene])

  useEffect(() => {
    const canvas = gl.domElement 
    const handleScroll = (e) => {
      if (!activeProject && isStarted) setRotationY((prev) => prev + e.deltaY * 0.0005)
    }
    const handlePointerDown = (e) => {
      if (activeProject || !isStarted) return 
      isDragging.current = true
      previousX.current = e.clientX
    }
    const handlePointerMove = (e) => {
      if (!isDragging.current || activeProject || !isStarted) return
      const deltaX = e.clientX - previousX.current
      setRotationY((prev) => prev - deltaX * 0.005)
      previousX.current = e.clientX
    }
    const handlePointerUp = () => { isDragging.current = false }
    
    window.addEventListener('wheel', handleScroll)
    canvas.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('wheel', handleScroll)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [activeProject, isStarted, gl, setRotationY])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // Background Shader Uniforms
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = t
    }

    // 1. Smooth Hub Rotation
    if (groupRef.current) {
      easing.dampE(groupRef.current.rotation, [0, rotationY, 0], 0.25, delta)
    }

    // 2. THE ORBIT ANIMATION
    if (orbitMeshRef.current) {
      const rotationSpeed = activeProject ? 0.3 : 0.15
      orbitMeshRef.current.rotation.y += delta * rotationSpeed
      orbitMeshRef.current.rotation.z = Math.sin(t * 0.4) * 0.05
      
      const pulseSpeed = activeProject ? 3.0 : 1.0
      const scaleBase = activeProject ? 1.05 : 1.0
      const s = scaleBase + Math.sin(t * pulseSpeed) * 0.02
      orbitMeshRef.current.scale.set(s, s, s)
    }
  })

  return (
    <>
      <CameraRig isStarted={isStarted} activeProject={activeProject} />
      
      {/* Background Shader - Positioned far back to act as world environment */}
      <mesh position={[0, 0, -20]} scale={[100, 100, 1]}>
        <planeGeometry />
        <shaderMaterial ref={shaderRef} args={[BackgroundShader]} depthWrite={false} />
      </mesh>

      <ambientLight intensity={0.1} />
      <pointLight position={[5, 15, 5]} intensity={3} color="#00f2ff" distance={60} />
      <spotLight 
        position={[0, 25, 10]} 
        angle={0.4} 
        penumbra={1} 
        intensity={2.5} 
        color="#ffffff"
      />

      <group ref={groupRef}>
        <Model onProjectSelect={onProjectSelect} activeProject={activeProject} />
      </group>
    </>
  )
}