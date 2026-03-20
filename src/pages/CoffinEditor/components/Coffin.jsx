import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function Model({ coffinMaterial = 'White Marble', metalColor = '#2C2C2C', ...props }) {
  const { nodes, materials } = useGLTF('/Coffin-transformed.glb')

  // Body Material Logic
  const activeBodyMat = useMemo(() => {
    if (coffinMaterial === 'Black Marble' && materials.Black_Marble) {
      const mat = materials.Black_Marble.clone();
      // Reduce metalness and roughness for the Black Marble here
      mat.metalness = 0.1; // Closer to 0 means less metallic
      mat.roughness = 0.2; // Closer to 0 means more polished/glossy
      return mat;
    }
    return materials.White_Marble;
  }, [coffinMaterial, materials]);

  // Metal Material Logic (The "True Color" Fix)
  const metalMat = useMemo(() => {
    const m = materials['Brushed used metal silver'].clone();
    
    // Base color setup
    m.color.set(metalColor); 
    m.metalness = 1.0;
    
    // Lower roughness = sharper, more professional reflections
    m.roughness = 0.35; 

    // THE SECRET: Add a tiny bit of the same color as an emissive glow.
    // This stops the metal from ever looking like "brown wood" or "black void."
    m.emissive = new THREE.Color(metalColor);
    m.emissiveIntensity = 0.15; 

    return m;
  }, [materials, metalColor]);

  return (
    <group {...props} dispose={null}>
      {/* Body */}
      <mesh geometry={nodes.Coffin.geometry} material={activeBodyMat} castShadow receiveShadow />

      {/* Exterior Metal Trim */}
      <mesh 
        geometry={nodes.Metal.geometry} 
        material={metalMat} 
        position={[0.002, 0.113, 0.582]} 
        rotation={[0.602, 0, 0]} 
        scale={[0.807, 0.009, 0.194]} 
        castShadow
      />

      {/* Interior Metal Lining */}
      <mesh 
        geometry={nodes.Metal_Inside.geometry} 
        material={metalMat} 
        position={[0, .035, -0.423]} 
        scale={[0.914, 0.16, 0.325]} 
      />
    </group>
  )
}

useGLTF.preload('/Coffin-transformed.glb')