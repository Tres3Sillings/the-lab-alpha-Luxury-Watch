import React, { useState, useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'

export function Model({ onProjectSelect, activeProject, ...props }) {
  // 1. Load the new file with Camera Anchors
  const { nodes, materials } = useGLTF('/TheLabHub_V2-transformed.glb')
  const group = useRef()
  
  // --- ROTATION STATE ---
  const [targetRotation, setTargetRotation] = useState(0)

  // --- LOGIC: Rotate Room on Scroll ---
  useEffect(() => {
    const handleScroll = (e) => {
      if (!activeProject) {
        setTargetRotation((prev) => prev + e.deltaY * 0.0005) 
      }
    }
    window.addEventListener('wheel', handleScroll)
    return () => window.removeEventListener('wheel', handleScroll)
  }, [activeProject])

  // --- LOGIC: Animation Loop ---
  useFrame((state, delta) => {
    easing.dampE(group.current.rotation, [0, targetRotation, 0], 0.25, delta)
  })
  
  // --- LOGIC: Cursor Pointer ---
  const [hovered, setHover] = useState(null)
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }, [hovered])

  return (
    <group ref={group} {...props} dispose={null}>
      
      {/* ===========================
          1. HIDDEN CAMERA ANCHORS
          (We keep them in the scene so the code can find them, 
           but make them invisible to the user)
         =========================== */}
      <mesh 
        name="Cam_Shoe"
        geometry={nodes.Cam_Shoe.geometry} 
        material={nodes.Cam_Shoe.material} 
        position={nodes.Cam_Shoe.position}
        rotation={nodes.Cam_Shoe.rotation}
        visible={false} 
      />
      <mesh 
        name="Cam_Watch"
        geometry={nodes.Cam_Watch.geometry} 
        material={nodes.Cam_Watch.material} 
        position={nodes.Cam_Watch.position}
        rotation={nodes.Cam_Watch.rotation}
        visible={false} 
      />

      {/* ===========================
          2. ENVIRONMENT
         =========================== */}
      <mesh geometry={nodes.Center_floor.geometry} material={materials['Wet Asphalt Surface']} />
      <mesh geometry={nodes.Floor.geometry} material={materials['Wet Cracked Asphalt']} />
      <mesh geometry={nodes.Pillars.geometry} material={materials['Anthracite Grey Plastic']} />
      <mesh geometry={nodes.Roof.geometry} material={materials['Matte plastic plate with holes']} />
      <mesh geometry={nodes.Walls.geometry} material={materials['Wet Cracked Asphalt']} />
      <mesh geometry={nodes.Floor_Pad.geometry} material={materials['Wet Asphalt Surface']} />
      <mesh 
        geometry={nodes.Orbit.geometry} 
        material={materials.Neon} 
        rotation={[0, 0.401, -Math.PI / 2]} 
        scale={15.564} 
      />

      {/* ===========================
          3. SHOE ARCADE
         =========================== */}
      <group name="Shoe_Group">
        <mesh geometry={nodes.Shoe_Arcade_Screen.geometry} material={materials['pantalas.001']} />
        <mesh geometry={nodes.Shoe_Arcade_1.geometry} material={materials['plastic.001']} />
        <mesh geometry={nodes.Shoe_Arcade_2.geometry} material={materials['metal.001']} />
        <mesh geometry={nodes.Shoe_Arcade_3.geometry} material={materials['covers .001']} />
        <mesh geometry={nodes.Shoe_Arcade_4.geometry} material={materials['coin arcade.001']} />
        <mesh geometry={nodes.Shoe_Arcade_5.geometry} material={materials['buttons arcade.001']} />
        <mesh geometry={nodes.Shoe_Arcade_6.geometry} material={materials['red plastic.001']} />

        {/* CLICKABLE HITBOX */}
        <mesh 
          geometry={nodes.Shoe_Arcade_HitBox.geometry} 
          material={materials.HitBox} 
          position={[5.437, 1.607, 0.027]} 
          visible={false} 
          onClick={(e) => {
             e.stopPropagation()
             console.log("👟 CLICKED SHOE")
             onProjectSelect('shoe')
          }}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        />
      </group>

      {/* ===========================
          4. WATCH ARCADE
         =========================== */}
      <group name="Watch_Group">
        <mesh geometry={nodes.Watch_Arcade_Screen.geometry} material={materials['pantalas.001']} />
        <mesh geometry={nodes.Watch_Arcade_1.geometry} material={materials['plastic.001']} />
        <mesh geometry={nodes.Watch_Arcade_2.geometry} material={materials['metal.001']} />
        <mesh geometry={nodes.Watch_Arcade_3.geometry} material={materials['covers .001']} />
        <mesh geometry={nodes.Watch_Arcade_4.geometry} material={materials['buttons arcade.001']} />
        <mesh geometry={nodes.Watch_Arcade_5.geometry} material={materials['coin arcade.001']} />
        <mesh geometry={nodes.Watch_Arcade_6.geometry} material={materials['red plastic.001']} />

        {/* CLICKABLE HITBOX */}
        <mesh 
          geometry={nodes.Watch_Arcade_HitBox.geometry} 
          material={materials.HitBox} 
          position={[3.818, 1.607, 3.85]} 
          visible={false}
          onClick={(e) => {
             e.stopPropagation()
             console.log("⌚ CLICKED WATCH")
             onProjectSelect('watch')
          }}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        />
      </group>

    </group>
  )
}

useGLTF.preload('/TheLabHub_V2-transformed.glb')