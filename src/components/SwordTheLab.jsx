import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function SwordModel({ activeBlade = 1, activeHilt = 1, activeHandle = 1, customColor = '#ffffff', ...props }) {
  const { nodes, materials } = useGLTF('/SwordTheLab.glb')

  // SAFETY CHECK: If nodes didn't load, return null to prevent crash
  if (!nodes) return null

  // Clone the material so changing color doesn't break everything
  // We use useMemo so we don't recreate it every frame
  const customMaterial = React.useMemo(() => {
    // SAFETY CHECK: If material is missing, return a default to prevent crash
    if (!materials || !materials.weaponMap_MAT) {
      console.warn('Material weaponMap_MAT not found in GLTF')
      return new THREE.MeshStandardMaterial({ color: customColor, roughness: 0.3, metalness: 1.0 })
    }

    const mat = materials.weaponMap_MAT ? materials.weaponMap_MAT.clone() : new THREE.MeshStandardMaterial()
    mat.color = new THREE.Color(customColor)
    return mat
  }, [customColor, materials])

  return (
    <group {...props} dispose={null}>
      
      {/* --- BLADES --- */}
      {activeBlade === 1 && nodes.Blade_1 && <mesh geometry={nodes.Blade_1.geometry} material={customMaterial} position={[0, 0.039, 0]} scale={0.05} />}
      {activeBlade === 2 && nodes.Blade_2 && <mesh geometry={nodes.Blade_2.geometry} material={customMaterial} position={[0, 0.04, 0]} scale={0.05} />}
      {activeBlade === 3 && nodes.Blade_3 && <mesh geometry={nodes.Blade_3.geometry} material={customMaterial} position={[0, 0.04, 0]} scale={0.05} />}
      {activeBlade === 4 && nodes.Blade_4 && <mesh geometry={nodes.Blade_4.geometry} material={customMaterial} position={[0, 0.04, 0]} scale={0.05} />}

      {/* --- HANDLES --- */}
      {/* Note: Corrected typo 'Handel_1' to 'Handle_1' if consistent, but kept your GLTF naming */}
      {activeHandle === 1 && (nodes.Handel_1 || nodes.Handle_1) && <mesh geometry={nodes.Handel_1?.geometry || nodes.Handle_1?.geometry} material={customMaterial} position={[0, 0.039, 0]} scale={0.05} />}
      {activeHandle === 2 && nodes.Handle_2 && <mesh geometry={nodes.Handle_2.geometry} material={customMaterial} position={[0, 0.04, 0]} scale={0.05} />}
      {activeHandle === 3 && nodes.Handle_3 && <mesh geometry={nodes.Handle_3.geometry} material={customMaterial} position={[0, 0.04, 0]} scale={0.05} />}
      {activeHandle === 4 && nodes.Handle_4 && <mesh geometry={nodes.Handle_4.geometry} material={customMaterial} position={[0, 0.04, 0]} scale={0.05} />}

      {/* --- HILTS --- */}
      {activeHilt === 1 && nodes.Hilt_1 && <mesh geometry={nodes.Hilt_1.geometry} material={customMaterial} position={[0, 0.039, 0]} scale={0.05} />}
      {activeHilt === 2 && nodes.Hilt_2 && <mesh geometry={nodes.Hilt_2.geometry} material={customMaterial} position={[0, 0.04, 0]} scale={0.05} />}
      {activeHilt === 3 && nodes.Hilt_3 && <mesh geometry={nodes.Hilt_3.geometry} material={customMaterial} position={[0, 0.04, 0]} scale={0.05} />}
      {activeHilt === 4 && nodes.Hilt_4 && <mesh geometry={nodes.Hilt_4.geometry} material={customMaterial} position={[0, 0.04, 0]} scale={0.05} />}

    </group>
  )
}

useGLTF.preload('/SwordTheLab.glb')