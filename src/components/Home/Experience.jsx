import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { easing } from 'maath'
import * as THREE from 'three'
import { Model } from '../Models/TheLabHub_V2'

function CameraRig({ isStarted, activeProject }) {
  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())
  const targetQuat = useRef(new THREE.Quaternion())
  const m = useRef(new THREE.Matrix4())
  
  const { scene } = useThree()

  useFrame((state, delta) => {
    // 1. DEFAULT HUB VIEW
    let p = [0.7, 2.24, 0.19]
    let t = [3.51, 1.2, 0.37]

    // 2. FIND OBJECTS
    const camShoeObj = scene.getObjectByName('Cam_Shoe')
    const camWatchObj = scene.getObjectByName('Cam_Watch')
    const shoeHitBox = scene.getObjectByName('Shoe_Arcade_HitBox')
    const watchHitBox = scene.getObjectByName('Watch_Arcade_HitBox')

    // 3. DETERMINE TARGETS
    if (activeProject === 'shoe' && camShoeObj && shoeHitBox) {
      camShoeObj.getWorldPosition(targetPos.current)
      shoeHitBox.getWorldPosition(targetLook.current)
    } 
    else if (activeProject === 'watch' && camWatchObj && watchHitBox) {
      camWatchObj.getWorldPosition(targetPos.current)
      watchHitBox.getWorldPosition(targetLook.current)
    } 
    else if (!isStarted) {
      // INTRO VIEW
      targetPos.current.set(-0.92, 18.96, 0.05)
      targetLook.current.set(-0.92, 0, 0.05)
    } 
    else {
      // HUB VIEW
      targetPos.current.set(...p)
      targetLook.current.set(...t)
    }

    // 4. APPLY SMOOTH MOVEMENT
    m.current.lookAt(targetPos.current, targetLook.current, state.camera.up)
    targetQuat.current.setFromRotationMatrix(m.current)

    easing.damp3(state.camera.position, targetPos.current, 0.4, delta)
    easing.dampQ(state.camera.quaternion, targetQuat.current, 0.4, delta)
  })

  return null
}

export default function Experience({ isStarted, activeProject, onProjectSelect, rotationY, setRotationY }) {
  const groupRef = useRef()
  const isDragging = useRef(false)
  const previousX = useRef(0)
  const { gl } = useThree()

  // --- SCROLL LOGIC ---
  useEffect(() => {
    const handleScroll = (e) => {
      if (!activeProject && isStarted) {
        setRotationY((prev) => prev + e.deltaY * 0.0005)
      }
    }
    window.addEventListener('wheel', handleScroll)
    return () => window.removeEventListener('wheel', handleScroll)
  }, [activeProject, isStarted, setRotationY])

  // --- DRAG LOGIC (REVERSED) ---
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
      
      // FIX: Changed '+' to '-' to reverse the drag direction
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

  // --- ANIMATE ROTATION ---
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