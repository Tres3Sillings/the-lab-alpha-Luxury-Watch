import React, { useMemo } from 'react'
import { useGLTF, Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'
import CoffinDecal from './CoffinDecal'

function Hotspot({ position, label, active, onClick, children, isExporting }) {
  if (isExporting) return null; // Hides the 3D buttons temporarily for the PDF screenshot
  return (
    <group position={position}>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        {/* The Hotspot Button */}
        <mesh 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
        >
          <circleGeometry args={[0.05, 32]} />
          <meshBasicMaterial color={active ? "#2563eb" : "#ffffff"} transparent opacity={active ? 0.2 : 1} />
          <mesh position={[0, 0, 0.001]}>
            <circleGeometry args={[0.03, 32]} />
            <meshBasicMaterial color={active ? "#ffffff" : "#2563eb"} transparent opacity={active ? 0.2 : 1} />
          </mesh>
        </mesh>

        {/* Text Label */}
        <Text 
          raycast={() => null} 
          position={[0, 0.12, 0]} 
          fontSize={0.035} 
          color="#1F2937" 
          outlineWidth={0.003} 
          outlineColor="#ffffff"
          anchorY="top"
        >
          {label}
        </Text>
        
        {/* The Options */}
        {active && (
          <group position={[0.2, 0, 0.15]}>
            {children}
          </group>
        )}
      </Billboard>
    </group>
  )
}

export function Model({ 
  coffinMaterial = 'White Marble', 
  metalColor = '#2C2C2C', 
  handleColor = '#2C2C2C', 
  handles = 'standard', 
  nameplate = 'standard', 
  nameplateColor = '#2C2C2C',
  ornamentColor = '#2C2C2C',
  decalImage = null, 
  activeHotspot,
  setActiveHotspot,
  isExporting,
  materialOptions,
  metalOptions,
  handleOptions,
  nameplateOptions,
  ornamentOptions,
  ...props 
}) {
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

  // Nameplate Material Logic
  const nameplateMat = useMemo(() => {
    const m = materials['Brushed used metal silver'].clone();
    m.color.set(nameplateColor); 
    m.metalness = 1.0;
    m.roughness = 0.35; 
    m.emissive = new THREE.Color(nameplateColor);
    m.emissiveIntensity = 0.15; 
    return m;
  }, [materials, nameplateColor]);

  // Ornament Material Logic
  const ornamentMat = useMemo(() => {
    const m = materials['Brushed used metal silver'].clone();
    m.color.set(ornamentColor); 
    m.metalness = 1.0;
    m.roughness = 0.35; 
    m.emissive = new THREE.Color(ornamentColor);
    m.emissiveIntensity = 0.15; 
    return m;
  }, [materials, ornamentColor]);

  return (
    <group {...props} dispose={null}>
      {/* Body */}
      <mesh 
        geometry={nodes.Coffin.geometry} 
        material={activeBodyMat} 
        castShadow 
        receiveShadow 
        onClick={(e) => { e.stopPropagation(); setActiveHotspot('material'); }}
      >
        <Hotspot 
          position={[0, 0.4, 0]} 
          label="Coffin Material" 
          active={activeHotspot === 'material'} 
          onClick={() => setActiveHotspot(activeHotspot === 'material' ? null : 'material')}
          isExporting={isExporting}
        >
          {materialOptions}
        </Hotspot>
      </mesh>

      <mesh geometry={nodes.Cube.geometry} material={materials.Black_Marble} position={[0, 0, -0.077]} scale={0.009} />

      {/* Exterior Metal Trim & Decal Group */}
      <group 
        position={[0.002, 0.108, 0.582]} 
        rotation={[0.602, 0, 0]}
        onClick={(e) => { e.stopPropagation(); setActiveHotspot('metal'); }}
      >
        <mesh 
          geometry={nodes.Metal.geometry} 
          material={metalMat} 
          scale={[0.807, 0.009, 0.194]} 
          castShadow
        >
          {/* Note: Decal MUST be inside the mesh block to attach to it! */}
          {decalImage && <CoffinDecal url={decalImage} />}
        </mesh>
        <Hotspot 
          position={[0, 0.05, 0.2]} 
          label="Metal Finish" 
          active={activeHotspot === 'metal'} 
          onClick={() => setActiveHotspot(activeHotspot === 'metal' ? null : 'metal')}
          isExporting={isExporting}
        >
          {metalOptions}
        </Hotspot>
      </group>

      {/* Inside Metal */}
      <mesh geometry={nodes.Metal_Inside.geometry} material={metalMat} position={[0, 0.024, -0.423]} scale={[0.914, 0.173, 0.325]} castShadow />

      {/* Handles Group */}
      <group onClick={(e) => { e.stopPropagation(); setActiveHotspot('handles'); }}>
        <Hotspot 
          position={[0.6, 0.3, 0.3]} 
          label="Handles & Hardware" 
          active={activeHotspot === 'handles'} 
          onClick={() => setActiveHotspot(activeHotspot === 'handles' ? null : 'handles')}
          isExporting={isExporting}
        >
          {handleOptions}
        </Hotspot>
        
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
      </group>

      {/* Nameplates */}
      <group onClick={(e) => { e.stopPropagation(); setActiveHotspot('nameplate'); }}>
        <Hotspot 
          position={[-0.7, 0.19, 0.586]} 
          label="Nameplate" 
          active={activeHotspot === 'nameplate'} 
          onClick={() => setActiveHotspot(activeHotspot === 'nameplate' ? null : 'nameplate')}
          isExporting={isExporting}
        >
          {nameplateOptions}
        </Hotspot>
        {nameplate === 'ornate' && (
          <mesh geometry={nodes.OrnateNameplate.geometry} material={nameplateMat} position={[-0.63, 0.119, 0.586]} rotation={[-0.96, 0, Math.PI / 2]} scale={0.164} castShadow />
        )}
        {nameplate === 'standard' && (
          <mesh geometry={nodes.NamePlate.geometry} material={nameplateMat} position={[-0.63, 0.119, 0.586]} rotation={[-0.96, 0, Math.PI / 2]} scale={0.164} castShadow />
        )}
      </group>

      {/* Ornaments */}
      <group onClick={(e) => { e.stopPropagation(); setActiveHotspot('ornament'); }}>
        <Hotspot 
          position={[0, 0.35, 0.35]} 
          label="Ornaments" 
          active={activeHotspot === 'ornament'} 
          onClick={() => setActiveHotspot(activeHotspot === 'ornament' ? null : 'ornament')}
          isExporting={isExporting}
        >
          {ornamentOptions}
        </Hotspot>
        {/* Note: Ornament meshes will be rendered here in the future, using ornamentMat */}
      </group>
    </group>
  )
}

useGLTF.preload('/Coffin-transformed.glb')