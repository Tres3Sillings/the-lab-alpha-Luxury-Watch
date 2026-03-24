import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import CoffinDecal from './CoffinDecal'

export function Model({ coffinMaterial = 'White Marble', metalColor = '#2C2C2C', handleColor = '#2C2C2C', decalImage = null, ...props }) {
  const { nodes, materials } = useGLTF('/Coffin-transformed.glb')

  // Body Material Logic
  const activeBodyMat = useMemo(() => {
    if (coffinMaterial === 'Black Marble' && materials.Black_Marble) {
      const mat = materials.Black_Marble.clone();
      mat.metalness = 0.1; 
      mat.roughness = 0.2; 
      return mat;
    }
    return materials.White_Marble;
  }, [coffinMaterial, materials]);

  // Metal Material Logic 
  const metalMat = useMemo(() => {
    const m = materials['Brushed used metal silver'].clone();
    m.color.set(metalColor); 
    m.metalness = 1.0;
    m.roughness = 0.35; 
    m.emissive = new THREE.Color(metalColor);
    m.emissiveIntensity = 0.15; 

    return m;
  }, [materials, metalColor]);

  // Handle Material Logic
  const handleMat = useMemo(() => {
    const m = materials['Brushed used metal silver'].clone();
    m.color.set(handleColor); 
    m.metalness = 1.0;
    m.roughness = 0.35; 
    m.emissive = new THREE.Color(handleColor);
    m.emissiveIntensity = 0.15; 
    return m;
  }, [materials, handleColor]);

  return (
    <group {...props} dispose={null}>
      {/* Body */}
      <mesh geometry={nodes.Coffin.geometry} material={activeBodyMat} castShadow receiveShadow />

      <mesh geometry={nodes.Cube.geometry} material={materials.Black_Marble} position={[0, 0, -0.077]} scale={0.009} />

      {/* Exterior Metal Trim & Decal Group */}
      <group position={[0.002, 0.113, 0.582]} rotation={[0.602, 0, 0]}>
        <mesh 
          geometry={nodes.Metal.geometry} 
          material={metalMat} 
          scale={[0.807, 0.009, 0.194]} 
          castShadow
        />
        {/* Because the Decal is inside this group, it perfectly inherits the lid's tilt and position! */}
        {decalImage && <CoffinDecal url={decalImage} />}
      </group>

      {/* Handle */}
      <mesh 
        geometry={nodes.Handle1.geometry} 
        material={handleMat} 
        position={[0.495, 0.245, 0.325]} 
        rotation={[-1.579, 0, 0]} 
        scale={0.165} 
      />
    </group>
  )
}

useGLTF.preload('/Coffin-transformed.glb')