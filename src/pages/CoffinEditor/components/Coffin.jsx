import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import CoffinDecal from './CoffinDecal'

export function Model({ coffinMaterial = 'White Marble', metalColor = '#2C2C2C', handleColor = '#2C2C2C', handles = 'standard', nameplate = 'standard', decalImage = null, ...props }) {
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

      {/* Inside Metal */}
      <mesh geometry={nodes.Metal_Inside.geometry} material={metalMat} position={[0, 0.024, -0.423]} scale={[0.914, 0.173, 0.325]} castShadow />

      {/* Ornate Handles */}
      {handles === 'ornate' && (
        <group>
          <mesh geometry={nodes.OrnateHandle1.geometry} material={handleMat} position={[0.495, 0.241, 0.326]} rotation={[-1.579, 0, 0]} scale={0.165} castShadow />
          <mesh geometry={nodes.OrnateHandle2.geometry} material={handleMat} position={[-0.005, 0.241, 0.326]} rotation={[-1.579, 0, 0]} scale={0.165} castShadow />
          <mesh geometry={nodes.OrnateHandle3.geometry} material={handleMat} position={[-0.497, 0.241, 0.326]} rotation={[-1.579, 0, 0]} scale={0.165} castShadow />
          <mesh geometry={nodes.OrnateHandle4.geometry} material={handleMat} position={[0.495, -0.084, 0.791]} rotation={[-0.571, 0, 0]} scale={0.165} castShadow />
          <mesh geometry={nodes.OrnateHandle5.geometry} material={handleMat} position={[0, -0.084, 0.791]} rotation={[-0.571, 0, 0]} scale={0.165} castShadow />
          <mesh geometry={nodes.OrnateHandle6.geometry} material={handleMat} position={[-0.494, -0.084, 0.791]} rotation={[-0.571, 0, 0]} scale={0.165} castShadow />
        </group>
      )}

      {/* Standard Handles */}
      {handles === 'standard' && (
        <group>
          <mesh geometry={nodes.StandardHandle1.geometry} material={handleMat} position={[0.495, 0.241, 0.326]} rotation={[1.452, 0.004, 0]} scale={0.164} castShadow />
          <mesh geometry={nodes.StandardHandle2.geometry} material={handleMat} position={[-0.005, 0.241, 0.326]} rotation={[1.452, 0.004, 0]} scale={0.164} castShadow />
          <mesh geometry={nodes.StandardHandle3.geometry} material={handleMat} position={[-0.497, 0.241, 0.326]} rotation={[1.452, 0.004, 0]} scale={0.164} castShadow />
          <mesh geometry={nodes.StandardHandle1001.geometry} material={handleMat} position={[0.495, -0.087, 0.789]} rotation={[3.08, 0.004, 0]} scale={0.164} castShadow />
          <mesh geometry={nodes.StandardHandle2001.geometry} material={handleMat} position={[-0.005, -0.087, 0.789]} rotation={[3.08, 0.004, 0]} scale={0.164} castShadow />
          <mesh geometry={nodes.StandardHandle3001.geometry} material={handleMat} position={[-0.497, -0.087, 0.789]} rotation={[3.08, 0.004, 0]} scale={0.164} castShadow />
        </group>
      )}

      {/* Plastic Handles */}
      {handles === 'plastic' && (
        <group>
          <mesh geometry={nodes.PlasticHandle.geometry} material={handleMat} position={[0.495, 0.241, 0.326]} rotation={[Math.PI / 2, 0, 0]} scale={0.164} castShadow />
          <mesh geometry={nodes.PlasticHandle001.geometry} material={handleMat} position={[-0.497, 0.241, 0.326]} rotation={[Math.PI / 2, 0, 0]} scale={0.164} castShadow />
          <mesh geometry={nodes.PlasticHandle002.geometry} material={handleMat} position={[-0.005, 0.241, 0.326]} rotation={[Math.PI / 2, 0, 0]} scale={0.164} castShadow />
          <mesh geometry={nodes.PlasticHandle003.geometry} material={handleMat} position={[0.495, -0.084, 0.791]} rotation={[2.656, 0, 0]} scale={0.164} castShadow />
          <mesh geometry={nodes.PlasticHandle004.geometry} material={handleMat} position={[0, -0.084, 0.791]} rotation={[2.656, 0, 0]} scale={0.164} castShadow />
          <mesh geometry={nodes.PlasticHandle005.geometry} material={handleMat} position={[-0.494, -0.084, 0.791]} rotation={[2.656, 0, 0]} scale={0.164} castShadow />
        </group>
      )}

      {/* Nameplates */}
      {nameplate === 'ornate' && (
        <mesh geometry={nodes.OrnateNameplate.geometry} material={handleMat} position={[-0.63, 0.119, 0.586]} rotation={[-0.96, 0, Math.PI / 2]} scale={0.164} castShadow />
      )}
      {nameplate === 'standard' && (
        <mesh geometry={nodes.NamePlate.geometry} material={handleMat} position={[-0.63, 0.119, 0.586]} rotation={[-0.96, 0, Math.PI / 2]} scale={0.164} castShadow />
      )}
    </group>
  )
}

useGLTF.preload('/Coffin-transformed.glb')