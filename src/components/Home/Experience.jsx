import React, { useEffect, useRef, useLayoutEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { easing } from 'maath'
import * as THREE from 'three'
import { Model } from '../Models/TheLabHub_V2'

// --- 1. THE CAMERA RIG (Handles Transitions & Logic) ---
function CameraRig({ isStarted, activeProject }) {
  const { scene } = useThree()

  const introPos = new THREE.Vector3(-0.92, 18.96, 0.05)
  const introLook = new THREE.Vector3(-0.92, 0, 0.05)
  const hubPos = new THREE.Vector3(0.7, 2.24, 0.19)
  const hubLook = new THREE.Vector3(3.51, 1.2, 0.37)

  // Initialize refs at intro position
  const targetPos = useRef(introPos.clone())
  const targetLook = useRef(introLook.clone())
  const targetQuat = useRef(new THREE.Quaternion())
  const m = useRef(new THREE.Matrix4())

  // REMOVED: useLayoutEffect (This was causing the insta-snap)

  useFrame((state, delta) => {
    const camShoeObj = scene.getObjectByName('Cam_Shoe')
    const camWatchObj = scene.getObjectByName('Cam_Watch')
    const shoeHitBox = scene.getObjectByName('Shoe_Arcade_HitBox')
    const watchHitBox = scene.getObjectByName('Watch_Arcade_HitBox')

    // DETERMINE TARGETS
    if (activeProject === 'shoe' && camShoeObj && shoeHitBox) {
      camShoeObj.getWorldPosition(targetPos.current)
      shoeHitBox.getWorldPosition(targetLook.current)
    } 
    else if (activeProject === 'watch' && camWatchObj && watchHitBox) {
      camWatchObj.getWorldPosition(targetPos.current)
      watchHitBox.getWorldPosition(targetLook.current)
    } 
    else if (!isStarted) {
      targetPos.current.copy(introPos)
      targetLook.current.copy(introLook)
    } 
    else {
      // When isStarted becomes true, this becomes the target
      // easing.damp will now slide the camera from introPos to hubPos
      targetPos.current.copy(hubPos)
      targetLook.current.copy(hubLook)
    }

    m.current.lookAt(targetPos.current, targetLook.current, state.camera.up)
    targetQuat.current.setFromRotationMatrix(m.current)

    // These handle the smooth "glide"
    easing.damp3(state.camera.position, targetPos.current, 0.5, delta)
    easing.dampQ(state.camera.quaternion, targetQuat.current, 0.5, delta)
  })

  return null
}

// --- 2. MAIN EXPERIENCE ---
export default function Experience({ isStarted, activeProject, onProjectSelect, rotationY, setRotationY }) {
  const groupRef = useRef()
  const isDragging = useRef(false)
  const previousX = useRef(0)
  const { gl } = useThree()

  useEffect(() => {
    const handleScroll = (e) => {
      if (!activeProject && isStarted) {
        setRotationY((prev) => prev + e.deltaY * 0.0005)
      }
    }
    window.addEventListener('wheel', handleScroll)
    return () => window.removeEventListener('wheel', handleScroll)
  }, [activeProject, isStarted, setRotationY])

  useEffect(() => {
    const canvas = gl.domElement 
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
      {/* 🚀 THE RIG IS BACK! */}
      <CameraRig isStarted={isStarted} activeProject={activeProject} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2ff" />

      <group ref={groupRef}>
        <Model onProjectSelect={onProjectSelect} activeProject={activeProject} />
      </group>
    </>
  )
}