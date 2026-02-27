import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/tablet-transformed.glb')
  
  return (
    <group {...props} dispose={null}>
      <mesh name="RightBase" geometry={nodes.RightBase.geometry} material={materials['Material.001']} position={[0.166, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={-1} />
      <mesh name="LeftBase" geometry={nodes.LeftBase.geometry} material={materials['Material.002']} position={[-0.184, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      
      {/* Just the glass, no HTML tags inside */}
      <mesh name="DrawingField" geometry={nodes.DrawingField.geometry} material={materials['Coated funky glass']} position={[0.001, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

export default Model
useGLTF.preload('/tablet-transformed.glb')