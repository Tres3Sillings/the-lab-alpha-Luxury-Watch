import React from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei' // <--- Import this here!
import * as THREE from 'three'
import { easing } from 'maath'
import { Model } from '../Models/TheLabHub_V2' // Adjust path if needed

function CameraRig({ isStarted, activeProject, nodes }) {
  const lookAtVec = new THREE.Vector3()
  const q = new THREE.Quaternion()
  const m = new THREE.Matrix4()

  // --- DYNAMIC CONFIGURATION ---
  // We build this using the nodes passed in props
  const projectConfig = {
  shoe: { 
    // 1. POSITION: Grab the exact spot from Blender
    // We use a small offset (+0.5 on Y) if it feels too low/inside the floor
    position: nodes.Cam_Shoe ? [
      nodes.Cam_Shoe.position.x + 1.2,
      nodes.Cam_Shoe.position.y - 0.2, // + 0.2 if you need it higher
      nodes.Cam_Shoe.position.z + -0.03
    ] : [4.5, 1.7, 1.5],

    // 2. ROTATION: IGNORE Blender's rotation. Use a target instead.
    // quaternion: nodes.Cam_Shoe?.quaternion, // <--- COMMENT THIS OUT

    // 3. TARGET: Look at the machine's specific coordinates
    target: [5.43, 1.6, 0.02] 
  },
  watch: { 
    position: nodes.Cam_Watch ? [
      nodes.Cam_Watch.position.x + .2,
      nodes.Cam_Watch.position.y - 0.2, //
        nodes.Cam_Watch.position.z + 0.3
    ] : [3.8, 1.6, 3.85],
    
    // quaternion: nodes.Cam_Watch?.quaternion, // <--- COMMENT THIS OUT
    
    target: [3.8, 1.6, 3.85]
  }
}

  useFrame((state, delta) => {
    // 1. SETUP DEFAULTS (Hub View)
    let targetPos = [0.7, 2.24, 0.19]
    let targetLook = [3.51, 1.2, 0.37]
    let targetQuat = null

    // 2. DETERMINE TARGET
    if (activeProject && projectConfig[activeProject]) {
      const config = projectConfig[activeProject]
      targetPos = config.position
      
      if (config.quaternion) {
        targetQuat = config.quaternion
      } else {
        targetLook = config.target
      }
    } 
    else if (!isStarted) {
       targetPos = [-0.92, 18.96, 0.05]
       targetLook = [-0.92, 0, 0.05] 
    }

    // 3. MOVE CAMERA
    easing.damp3(state.camera.position, targetPos, 0.4, delta)

    // 4. ROTATE CAMERA
    if (targetQuat) {
      q.copy(targetQuat)
    } else {
      lookAtVec.set(...targetLook)
      m.lookAt(state.camera.position, lookAtVec, state.camera.up)
      q.setFromRotationMatrix(m)
    }
    easing.dampQ(state.camera.quaternion, q, 0.4, delta)
  })

  return null
}

export default function Experience({ isStarted, activeProject, onProjectSelect }) {
  // Load the file HERE to get the camera nodes
  const { nodes } = useGLTF('/TheLabHub_V2-transformed.glb')

  return (
    <>
      <CameraRig 
        isStarted={isStarted} 
        activeProject={activeProject} 
        nodes={nodes} // Pass the loaded nodes to the Rig
      />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2ff" />

      <Model 
        onProjectSelect={onProjectSelect} 
        activeProject={activeProject} 
      />
    </>
  )
}