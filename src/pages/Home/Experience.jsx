import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { easing } from 'maath'
import * as THREE from 'three'
import { Model } from './components/TheLabHub_V2.jsx'

// --- MAP ACTIVE PROJECT TO OBJECT NAMES ---
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
  
  // Default Intro / Hub positions
  const pos_Start = [-0.92, 18.96, 0.05]
  const look_Start = [-0.92, 0, 0.05]
  const pos_Hub = [0.7, 2.24, 0.19]
  const look_Hub = [3.51, 1.2, 0.37]

  const targetPos = useRef(new THREE.Vector3(...pos_Start))
  const targetLook = useRef(new THREE.Vector3(...look_Start))
  const targetQuat = useRef(new THREE.Quaternion())
  const m = useRef(new THREE.Matrix4())

  

  useFrame((state, delta) => {
    // 1. DETERMINE WHICH OBJECTS TO FIND
    let foundCam = null
    let foundTarget = null

    if (activeProject && PROJECT_MAP[activeProject]) {
      const names = PROJECT_MAP[activeProject]
      foundCam = scene.getObjectByName(names.cam)
      foundTarget = scene.getObjectByName(names.target)
    }

    // 2. SET TARGET POSITIONS
    if (foundCam && foundTarget) {
      // FIX: Force the scene to update math so we don't get (0,0,0)
      foundCam.updateMatrixWorld()
      foundTarget.updateMatrixWorld()

      foundCam.getWorldPosition(targetPos.current)
      foundTarget.getWorldPosition(targetLook.current)
    } 
    else if (!isStarted) {
      targetPos.current.set(...pos_Start)
      targetLook.current.set(...look_Start)
    } 
    else {
      targetPos.current.set(...pos_Hub)
      targetLook.current.set(...look_Hub)
    }

    // 3. APPLY SMOOTH ANIMATION
    m.current.lookAt(targetPos.current, targetLook.current, state.camera.up)
    targetQuat.current.setFromRotationMatrix(m.current)

    easing.damp3(state.camera.position, targetPos.current, 0.5, delta)
    easing.dampQ(state.camera.quaternion, targetQuat.current, 0.5, delta)
  })

  return null
}

export default function Experience({ isStarted, activeProject, onProjectSelect, rotationY, setRotationY }) {
  const groupRef = useRef()
  const isDragging = useRef(false)
  const previousX = useRef(0)
  const { gl } = useThree()

  // Scroll Logic
  useEffect(() => {
    const handleScroll = (e) => {
      if (!activeProject && isStarted) {
        setRotationY((prev) => prev + e.deltaY * 0.0005)
      }
    }
    window.addEventListener('wheel', handleScroll)
    return () => window.removeEventListener('wheel', handleScroll)
  }, [activeProject, isStarted, setRotationY])

  // Drag Logic
  useEffect(() => {
    const canvas = gl.domElement 
    const handlePointerDown = (e) => {
      if (activeProject || !isStarted) return 
      isDragging.current = true
      previousX.current = e.clientX
      document.body.style.cursor = 'grabbing'
    }
    const handlePointerMove = (e) => {
      if (!isDragging.current || activeProject || !isStarted) return
      const deltaX = e.clientX - previousX.current
      setRotationY((prev) => prev - deltaX * 0.005)
      previousX.current = e.clientX
    }
    const handlePointerUp = () => { 
      isDragging.current = false 
      document.body.style.cursor = 'auto'
    }
    
    canvas.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [activeProject, isStarted, gl, setRotationY])

  useFrame((state, delta) => {
    if (groupRef.current) {
      easing.dampE(groupRef.current.rotation, [0, rotationY, 0], 0.25, delta)
    }
  })

  return (
    <>
      <CameraRig isStarted={isStarted} activeProject={activeProject} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2ff" />
      <group ref={groupRef}>
        <Model onProjectSelect={onProjectSelect} activeProject={activeProject} />
      </group>
    </>
  )
}