import React, { useState, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber' // <--- Added useThree
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { easing } from 'maath'
import { Model } from '../Models/TheLabHub_V2'

function CameraRig({ isStarted, activeProject }) {
  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())
  const targetQuat = useRef(new THREE.Quaternion())
  const m = useRef(new THREE.Matrix4())
  
  // 1. GET THE SCENE TO FIND OBJECTS
  const { scene } = useThree()

  useFrame((state, delta) => {
    let p = [0.7, 2.24, 0.19]
    let t = [3.51, 1.2, 0.37]

    // 2. FIND THE ACTUAL SPINNING OBJECTS
    // We look for them by name because they are inside the rotating group
    const camShoeObj = scene.getObjectByName('Cam_Shoe')
    const camWatchObj = scene.getObjectByName('Cam_Watch')
    const shoeHitBox = scene.getObjectByName('Shoe_Arcade_HitBox')
    const watchHitBox = scene.getObjectByName('Watch_Arcade_HitBox')

    // 3. LIVE TRACKING
    if (activeProject === 'shoe' && camShoeObj && shoeHitBox) {
      camShoeObj.getWorldPosition(targetPos.current)
      shoeHitBox.getWorldPosition(targetLook.current)
    } 
    else if (activeProject === 'watch' && camWatchObj && watchHitBox) {
      camWatchObj.getWorldPosition(targetPos.current)
      watchHitBox.getWorldPosition(targetLook.current)
    } 
    else if (!isStarted) {
      targetPos.current.set(-0.92, 18.96, 0.05)
      targetLook.current.set(-0.92, 0, 0.05)
    } else {
      targetPos.current.set(...p)
      targetLook.current.set(...t)
    }

    // 4. SMOOTH ANIMATION
    m.current.lookAt(targetPos.current, targetLook.current, state.camera.up)
    targetQuat.current.setFromRotationMatrix(m.current)

    easing.damp3(state.camera.position, targetPos.current, 0.4, delta)
    easing.dampQ(state.camera.quaternion, targetQuat.current, 0.4, delta)
  })

  return null
}

export default function Experience({ isStarted, activeProject, onProjectSelect }) {
  const [rotationY, setRotationY] = useState(0)
  const groupRef = useRef()
  
  // DRAG STATE
  const isDragging = useRef(false)
  const previousX = useRef(0)
  
  // Access the canvas element to attach events
  const { gl } = useThree()

  // --- 1. SCROLL LOGIC ---
  useEffect(() => {
    const handleScroll = (e) => {
      if (!activeProject) {
        setRotationY((prev) => prev + e.deltaY * 0.0005)
      }
    }
    window.addEventListener('wheel', handleScroll)
    return () => window.removeEventListener('wheel', handleScroll)
  }, [activeProject])

  // --- 2. DRAG LOGIC (NEW) ---
  useEffect(() => {
    const canvas = gl.domElement // Only listen for clicks on the 3D canvas

    const handlePointerDown = (e) => {
      if (activeProject) return // Don't rotate if focused on a project
      isDragging.current = true
      previousX.current = e.clientX
      document.body.style.cursor = 'grabbing' // UX Polish
    }

    const handlePointerMove = (e) => {
      if (!isDragging.current || activeProject) return
      
      // Calculate how far we moved
      const deltaX = e.clientX - previousX.current
      
      // Update Rotation (Adjust 0.005 to make it faster/slower)
      setRotationY((prev) => prev + deltaX * 0.005)
      
      previousX.current = e.clientX
    }

    const handlePointerUp = () => {
      isDragging.current = false
      document.body.style.cursor = 'auto'
    }

    // Attach 'Down' to Canvas (so UI buttons don't trigger rotation)
    canvas.addEventListener('pointerdown', handlePointerDown)
    // Attach 'Move/Up' to Window (so you can drag off-screen without losing it)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [activeProject, gl])

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