import React, { useRef } from 'react'
import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function RocketAwebco(props) {
  const { nodes, materials } = useGLTF('/rocketawebco-transformed.glb')
  const flameRef = useRef()
  const scroll = useScroll()

  useFrame((state) => {
    const offset = scroll.offset
    
    if (flameRef.current) {
      // Thrust ramps up as the user scrolls past the 0.05 mark
      const thrust = THREE.MathUtils.smoothstep(offset, 0.05, 0.2)
      
      // Stretch the flame downwards
      flameRef.current.scale.y = 1 + thrust * 4
      
      // Add high-frequency flicker to X and Z for a realistic burn
      const flicker = Math.sin(state.clock.elapsedTime * 50) * 0.05
      flameRef.current.scale.x = 1 + flicker
      flameRef.current.scale.z = 1 + flicker

      // Dynamically fade in the opacity of the flame meshes
      flameRef.current.children.forEach(child => {
         // The outer glow maxes at 0.6 opacity, the core maxes at 0.9
         const maxOpacity = child.geometry.parameters.radius > 0.2 ? 0.6 : 0.9
         child.material.opacity = thrust * maxOpacity
      })
    }
  })

  return (
    <group {...props} dispose={null}>
      {/* Original Rocket Meshes */}
      <group rotation={[1.546, 0.006, -2.999]} scale={0.057}>
        <mesh geometry={nodes['Object_59_Plastic_(1)_0_1'].geometry} material={materials.Plastic_1} />
        <mesh geometry={nodes['Object_59_Plastic_(1)_0_2'].geometry} material={materials['Blue Carbon Fiber']} />
        <mesh geometry={nodes['Object_59_Plastic_(1)_0_3'].geometry} material={materials.Plastic_2} />
        <mesh geometry={nodes['Object_59_Plastic_(1)_0_4'].geometry} material={materials.Plastic_3} />
        <mesh geometry={nodes['Object_59_Plastic_(1)_0_5'].geometry} material={materials.Metal_1} />
      </group>

      {/* --- LAUNCH JET FLAMES --- */}
      {/* Note: You may need to slightly adjust position Y ([0, -0.6, 0]) so it sits perfectly inside your thruster bell */}
      <group ref={flameRef} position={[0, -0.6, 0]}>
        
        {/* Outer Blue Glow */}
        <mesh position={[0, -0.75, 0]}>
          <coneGeometry args={[0.35, 1.5, 32]} />
          <meshBasicMaterial 
            color="#0088ff" 
            transparent 
            opacity={0} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
          />
        </mesh>

        {/* Inner White-Hot Core */}
        <mesh position={[0, -0.4, 0]}>
          <coneGeometry args={[0.15, 0.8, 16]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
          />
        </mesh>

      </group>
    </group>
  )
}
useGLTF.preload('/rocketawebco-transformed.glb')